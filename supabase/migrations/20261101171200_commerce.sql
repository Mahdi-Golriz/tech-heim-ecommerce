-- Cart, wishlist and orders

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  color text not null,
  quantity integer not null check (quantity > 0 and quantity <= 99),
  created_at timestamptz not null default now(),
  unique (user_id, product_id, color)
);

create index cart_items_product_id_idx on public.cart_items (product_id);

create table public.wishlist_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create index wishlist_items_product_id_idx on public.wishlist_items (product_id);

create type public.order_status as enum ('paid', 'cancelled');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status public.order_status not null default 'paid',
  email text not null,
  subtotal numeric(10, 2) not null,
  discount numeric(10, 2) not null,
  shipping_method text not null references public.shipping_methods (code),
  shipping_cost numeric(10, 2) not null,
  total numeric(10, 2) not null,
  card_last4 char(4) not null check (card_last4 ~ '^[0-9]{4}$'),
  delivery_address text not null,
  billing_address text not null,
  created_at timestamptz not null default now()
);

create index orders_user_id_created_at_idx on public.orders (user_id, created_at desc);
create index orders_shipping_method_idx on public.orders (shipping_method);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  title text not null,
  color text not null,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0)
);

create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_product_id_idx on public.order_items (product_id);

alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Users manage their own cart" on public.cart_items
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users read their own wishlist" on public.wishlist_items
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users add to their own wishlist" on public.wishlist_items
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users remove from their own wishlist" on public.wishlist_items
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Orders are written only by place_order(); clients can only read their own.
create policy "Users read their own orders" on public.orders
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users read their own order items" on public.order_items
  for select to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = (select auth.uid())
    )
  );
