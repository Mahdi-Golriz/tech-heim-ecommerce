# Tech Heim

E-commerce storefront built with **Next.js 16** (App Router, ISR, Server Actions), **Supabase** (Postgres, Auth, Storage, RLS), next-intl (en/de), zustand, react-hook-form and zod.

## Getting started

1. Copy `.env.example` to `.env.local` and fill in the values from *Supabase → Project Settings → API Keys*:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

2. Set up the database (see below), then start the app:

   ```bash
   npm install
   npm run dev
   ```

## Database

The schema lives in `supabase/migrations/` and is the source of truth. Apply it with the Supabase MCP server (`.mcp.json`), the SQL editor, or the CLI (`npx supabase db push`).

| Migration | Contents |
|---|---|
| `…171142_catalog` | categories, products (generated `final_price`, `on_sale`, full-text `search_vector`), product images, shipping methods |
| `…171143_profiles` | profiles + `handle_new_user` trigger (a profile is created on sign-up) |
| `…171200_commerce` | cart items, wishlist items, orders, order items |
| `…171144_rpcs` | `add_to_cart`, `set_cart_item_quantity`, `merge_cart`, `place_order` |
| `…171145_storage` | public `product-images` / `category-images` buckets |
| `…171305_document_place_order` | documents why `place_order` is `SECURITY DEFINER` (advisor lint 0029 is expected) |
| `…191933_demo_user_guard` | `protect_demo_user` trigger: keeps the demo account's email and password fixed |

Every table has RLS enabled. The catalog is publicly readable. Carts and wishlists are only visible to their owner. Orders are read-only for clients and can only be created through `place_order`, which computes prices on the server.

**Sample data:**

```bash
# 1. run supabase/seed.sql in the SQL editor (or via MCP execute_sql)
# 2. mirror the images to Storage (needs the secret key, never commit it)
SUPABASE_SECRET_KEY=sb_secret_... node --env-file=.env.local scripts/sync-images.mjs
```

**Catalog images:** category thumbnails and product photos come from `src/assets/category-images` and `src/assets/products` and are served from the `category-images` and `product-images` buckets (not bundled). The other files in `src/assets` (hero, banners, FAQ, logo, …) are imported directly by their components. `scripts/sync-images.mjs` uploads them, deletes bucket objects that no longer exist locally, and rewrites `product_images` / `categories.thumbnail_path` from its maps. When you add or rename a photo, update `PRODUCT_IMAGES` there and the matching list in `seed.sql`, then rerun the script.

**Demo account:** visitors can sign in with *Continue with demo account* (`demo@example.com` / `TechHeimDemo2026`, see `src/lib/demo-data.ts`). The account is shared, so the `protect_demo_user` trigger silently ignores changes to its email or password. Create it once per project with the SQL editor (or MCP `execute_sql`): insert the user into `auth.users` with `extensions.crypt('<password>', extensions.gen_salt('bf'))` and `email_confirmed_at = now()`, plus a matching `email` row in `auth.identities`. To change its password, temporarily `alter table auth.users disable trigger protect_demo_user`.

**Types:** after changing the schema, regenerate `src/types/database.types.ts`:

```bash
npx supabase login   # once, or set SUPABASE_ACCESS_TOKEN=sbp_...
npm run db:types
```

## Architecture

```
src/
  app/            routes (Server Components); [locale] segment from next-intl
  components/     UI; client components receive data as props
  data/           server-only: cached public catalog reads, session helper
  actions/        Server Actions for mutations: zod-validate → service → ActionResult
  services/       data access, one module per domain; takes a typed Supabase client
  mappers/        DB rows → domain models
  models/         domain types
  validations/    zod schemas shared by forms and actions
  hooks/ store/   client state (zustand) and hooks wrapping actions with optimistic updates
  lib/supabase/   server / browser / public (cookie-less) clients, session refresh for proxy.ts
```

- Catalog pages (home, product detail) are statically rendered with ISR and use the cookie-less client through `src/data/catalog.ts`.
- User data (header cart, wishlist) is hydrated on the client by `SessionInitializer`, so public pages stay static. Profile and payment pages are rendered on the server and guarded by `getClaims()`.
- `src/proxy.ts` runs next-intl routing, then refreshes the Supabase auth cookies.

## Scripts

| Script | |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | generate route types + `tsc --noEmit` |
| `npm run db:types` | regenerate Supabase types |
