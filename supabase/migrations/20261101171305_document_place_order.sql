-- place_order is intentionally SECURITY DEFINER: orders/order_items have no
-- insert policy, so this function is the only way to create an order, and it
-- recomputes all prices server-side. Advisor lint 0029 is expected here.
comment on function public.place_order(text, text, text, text) is
  'Intentionally SECURITY DEFINER (advisor lint 0029 expected): sole writer of orders; computes totals from catalog prices for auth.uid().';
