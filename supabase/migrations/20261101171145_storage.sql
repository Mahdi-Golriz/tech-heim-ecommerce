-- Public image buckets. Uploads happen through the dashboard or service role only.
insert into storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
values
  ('product-images', 'product-images', true, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'], 5242880),
  ('category-images', 'category-images', true, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'], 5242880)
on conflict (id) do nothing;
