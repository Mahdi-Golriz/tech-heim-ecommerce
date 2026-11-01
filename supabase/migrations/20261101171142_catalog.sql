-- Catalog: categories, products, product images, shipping methods (public read-only)

create table public.categories (
  id smallint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  description text,
  thumbnail_path text,
  position smallint not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  price numeric(10, 2) not null check (price > 0),
  discount_percentage smallint check (discount_percentage between 1 and 90),
  final_price numeric(10, 2) generated always as (
    round(price * (100 - coalesce(discount_percentage, 0)) / 100, 2)
  ) stored,
  on_sale boolean generated always as (coalesce(discount_percentage, 0) > 0) stored,
  is_new boolean not null default false,
  rate numeric(2, 1) check (rate between 0 and 5),
  colors text[] not null default '{}',
  details jsonb not null default '{}'::jsonb,
  category_id smallint not null references public.categories (id) on delete restrict,
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on public.products (category_id);
create index products_final_price_idx on public.products (final_price);
create index products_created_at_idx on public.products (created_at desc);
create index products_on_sale_idx on public.products (on_sale) where on_sale;
create index products_search_vector_idx on public.products using gin (search_vector);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt text,
  position smallint not null default 0
);

create index product_images_product_id_position_idx on public.product_images (product_id, position);

create table public.shipping_methods (
  code text primary key,
  price numeric(10, 2) not null check (price >= 0),
  position smallint not null default 0
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.shipping_methods enable row level security;

create policy "Categories are public" on public.categories
  for select to anon, authenticated using (true);
create policy "Products are public" on public.products
  for select to anon, authenticated using (true);
create policy "Product images are public" on public.product_images
  for select to anon, authenticated using (true);
create policy "Shipping methods are public" on public.shipping_methods
  for select to anon, authenticated using (true);

-- Shared trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();
