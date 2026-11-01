-- Business logic for the shopping flow. Errors are raised with stable
-- machine-readable messages that the app maps to translated text.

-- Adds a product/colour to the caller's cart, incrementing if it already exists.
create or replace function public.add_to_cart(p_product_id uuid, p_color text, p_quantity integer default 1)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '42501';
  end if;

  if p_quantity < 1 then
    raise exception 'INVALID_QUANTITY' using errcode = '22023';
  end if;

  if not exists (
    select 1 from public.products p
    where p.id = p_product_id and p_color = any (p.colors)
  ) then
    raise exception 'INVALID_PRODUCT' using errcode = '22023';
  end if;

  insert into public.cart_items (user_id, product_id, color, quantity)
  values ((select auth.uid()), p_product_id, p_color, least(p_quantity, 99))
  on conflict (user_id, product_id, color)
  do update set quantity = least(public.cart_items.quantity + excluded.quantity, 99);
end;
$$;

-- Sets the quantity of one cart line; 0 or less removes it.
create or replace function public.set_cart_item_quantity(p_item_id uuid, p_quantity integer)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_quantity <= 0 then
    delete from public.cart_items
    where id = p_item_id and user_id = (select auth.uid());
  else
    update public.cart_items
    set quantity = least(p_quantity, 99)
    where id = p_item_id and user_id = (select auth.uid());
  end if;
end;
$$;

-- Merges a guest cart ([{product_id, color, quantity}]) into the caller's cart in one call.
-- Invalid products/colours are skipped silently.
create or replace function public.merge_cart(p_items jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '42501';
  end if;

  insert into public.cart_items (user_id, product_id, color, quantity)
  select (select auth.uid()), i.product_id, i.color, least(sum(i.quantity), 99)
  from jsonb_to_recordset(p_items) as i (product_id uuid, color text, quantity integer)
  join public.products p on p.id = i.product_id and i.color = any (p.colors)
  where i.quantity > 0
  group by i.product_id, i.color
  on conflict (user_id, product_id, color)
  do update set quantity = least(public.cart_items.quantity + excluded.quantity, 99);
end;
$$;

-- Atomically turns the caller's cart into an order. Prices always come from
-- the products table, never from the client. Returns the new order id.
create or replace function public.place_order(
  p_shipping_method text,
  p_delivery_address text,
  p_billing_address text,
  p_card_last4 text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_email text;
  v_shipping_cost numeric(10, 2);
  v_subtotal numeric(10, 2);
  v_discount numeric(10, 2);
  v_line_count integer;
  v_order_id uuid;
begin
  if v_user_id is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '42501';
  end if;

  if p_card_last4 !~ '^[0-9]{4}$'
     or length(trim(coalesce(p_delivery_address, ''))) < 1
     or length(trim(coalesce(p_billing_address, ''))) < 5 then
    raise exception 'INVALID_ORDER_DATA' using errcode = '22023';
  end if;

  select sm.price into v_shipping_cost
  from public.shipping_methods sm
  where sm.code = p_shipping_method;

  if not found then
    raise exception 'INVALID_SHIPPING_METHOD' using errcode = '22023';
  end if;

  select u.email into v_email from auth.users u where u.id = v_user_id;

  -- Lock the cart so concurrent submits can't double-order.
  perform 1 from public.cart_items ci where ci.user_id = v_user_id for update;

  select
    count(*),
    coalesce(sum(p.price * ci.quantity), 0),
    coalesce(sum((p.price - p.final_price) * ci.quantity), 0)
  into v_line_count, v_subtotal, v_discount
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.user_id = v_user_id;

  if v_line_count = 0 then
    raise exception 'CART_EMPTY' using errcode = 'P0001';
  end if;

  insert into public.orders (
    user_id, email, subtotal, discount, shipping_method, shipping_cost, total,
    card_last4, delivery_address, billing_address
  )
  values (
    v_user_id, v_email, v_subtotal, v_discount, p_shipping_method, v_shipping_cost,
    v_subtotal - v_discount + v_shipping_cost,
    p_card_last4, trim(p_delivery_address), trim(p_billing_address)
  )
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, title, color, unit_price, quantity)
  select v_order_id, p.id, p.title, ci.color, p.final_price, ci.quantity
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.user_id = v_user_id;

  delete from public.cart_items where user_id = v_user_id;

  return v_order_id;
end;
$$;

revoke execute on function public.add_to_cart(uuid, text, integer) from public, anon;
revoke execute on function public.set_cart_item_quantity(uuid, integer) from public, anon;
revoke execute on function public.merge_cart(jsonb) from public, anon;
revoke execute on function public.place_order(text, text, text, text) from public, anon;

grant execute on function public.add_to_cart(uuid, text, integer) to authenticated;
grant execute on function public.set_cart_item_quantity(uuid, integer) to authenticated;
grant execute on function public.merge_cart(jsonb) to authenticated;
grant execute on function public.place_order(text, text, text, text) to authenticated;
