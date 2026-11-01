# Tech Heim — Electronics E-commerce Storefront

A full-featured, bilingual (English / German) online store for consumer electronics, built with **Next.js 16 (App Router)**, **React 19**, **TypeScript** and **Supabase**.

The project covers the whole shopping flow: browsing and searching the catalog, a guest cart that merges into the account on sign-in, wishlist, checkout with an interactive map, payment and order history. The focus is on a production-style architecture: static rendering where possible, type safety end to end, and business rules enforced by the database instead of the browser.

**🔗 Live demo:** [tech-heim.example.com](https://tech-heim.example.com) &nbsp;·&nbsp; Click **Continue with demo account** to try the signed-in flow without registering.

<!-- Screenshot: add a desktop/mobile screenshot here, e.g. ![Tech Heim home page](docs/screenshot.png) -->

---

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions, ISR), React 19 |
| Language | TypeScript (strict), types generated from the database schema |
| Styling & UI | Tailwind CSS, Radix UI primitives (shadcn/ui pattern), class-variance-authority, Framer Motion, Swiper |
| State | Zustand (with `persist` for the guest cart and checkout) |
| Forms & validation | React Hook Form + Zod (one schema shared by the form and the Server Action) |
| Backend | Supabase: PostgreSQL, Auth, Storage, Row Level Security, PL/pgSQL functions |
| i18n | next-intl (locale-prefixed routes `/en`, `/de`) |
| Maps | Leaflet / React Leaflet + OpenStreetMap Nominatim geocoding |
| Tooling | ESLint (flat config), Supabase CLI, SQL migrations |

## Features

### Shopping

- Home page with hero, category slider, new arrivals and a sale section
- Product listing with category, price range and on-sale filters, sorting and pagination. All state lives in the URL, so every result is shareable and the back button works
- Search that combines Postgres full-text search (stemmed, weighted title > description) with prefix matching (`iph` → iPhone)
- Product detail pages with image slider, colour selection, specs and similar products
- Cart that works for guests (stored locally) and signed-in users (stored in the database). The guest cart is merged into the account on sign-in

### Account

- Sign up / sign in with Supabase Auth, plus a one-click shared demo account
- Wishlist
- Profile page with editable personal data, order history and wishlist tab

### Checkout

- Shipping address picked on a Leaflet map (click to reverse-geocode, or search an address)
- Shipping methods and prices loaded from the database
- Simulated payment step. The order is created on the server and only the card's last 4 digits are stored

### General

- Fully translated UI in English and German
- Responsive, mobile-first layout with a separate mobile navigation and footer
- Optimistic UI with toast feedback and automatic rollback when a request fails

## Architecture

```text
src/
  app/            routes: Server Components under a [locale] segment, route groups for layouts
  components/     UI; client components receive data as props
  data/           server-only, cached catalog reads and the session helper
  actions/        Server Actions: validate with zod → call a service → return ActionResult
  services/       data access, one module per domain, takes a typed Supabase client
  mappers/        database rows → domain models
  models/         domain types
  validations/    zod schemas shared by forms, actions and URL parsing
  store/ hooks/   Zustand stores and hooks that wrap actions with optimistic updates
  lib/supabase/   server, browser and cookie-less public clients
  proxy.ts        locale routing + Supabase session refresh (Next 16 middleware)
supabase/
  migrations/     schema, RLS policies, RPC functions, storage buckets
  seed.sql        sample catalog
```

### Rendering strategy

| Page | Rendering | Why |
| --- | --- | --- |
| Home, product detail | Static + ISR (hourly); top products prerendered, the rest generated on first request | Fast, cacheable, SEO-friendly |
| Product listing | Dynamic | Depends on search params |
| Profile, payment | Dynamic, server-rendered behind an auth check | Personal data |

Catalog reads use a **cookie-less Supabase client** wrapped in `unstable_cache` with cache tags, so public pages never become dynamic because of auth cookies. User-specific data (cart badge, wishlist hearts) is loaded on the client by a `SessionInitializer`, which keeps the shared pages static.

### Data flow for mutations

```text
Component → hook (optimistic store update)
          → Server Action (zod validation, auth check)
          → service → Supabase RPC (business rules, RLS)
          ← ActionResult<T>  { ok: true, data } | { ok: false, error: { code } }
          → store reconciles with server data, or rolls back + translated toast
```

Errors cross the server/client boundary as **typed, serialisable codes** (`CART_EMPTY`, `INVALID_PRODUCT`, …) that the UI translates, never as raw exceptions.

### Database and security

- **Row Level Security on every table.** The catalog is public; carts, wishlists, profiles and orders are visible only to their owner.
- **Business logic in Postgres functions.** `add_to_cart`, `merge_cart`, `set_cart_item_quantity` and `place_order` validate input and raise stable error codes. They run with a fixed `search_path` and are not callable by anonymous users.
- **Prices are computed on the server.** Clients cannot write orders directly. `place_order` reads the cart under a row lock, recomputes totals from current prices, snapshots the items and empties the cart in one transaction.
- **Computed columns** (`final_price`, `on_sale`, `search_vector`) are generated by Postgres, with indexes for filtering, sorting and a GIN index for full-text search.
- A trigger keeps the shared demo account's email and password from being changed.

## Practices used

- **Server-first React:** Server Components by default, client components only where interactivity is needed
- **End-to-end type safety:** database types generated from the live schema, mapped into domain models, zod-inferred types for inputs
- **One schema per concern:** the same zod schema validates the form on the client and the Server Action on the server; the product-listing URL is parsed by a schema that falls back to defaults on invalid values, so a hand-edited URL never breaks the page
- **Layered architecture:** actions → services → mappers, with services taking the Supabase client as a parameter so the same code runs on the server and in the browser
- **Defence in depth:** client validation, server validation, RLS and database constraints
- **Caching with tags** (`revalidateTag`) for targeted invalidation of catalog data
- **Accessible UI primitives** from Radix UI
- **Schema as code:** versioned SQL migrations are the single source of truth for the database

> This project started on a Strapi backend and was migrated to Supabase together with an upgrade to Next.js 16. The migration notes are in [`plan/plan.md`](plan/plan.md).

## Running locally

**Requirements:** Node.js 20+ and a Supabase project.

1. Install dependencies and create your env file:

   ```bash
   npm install
   cp .env.example .env.local
   ```

   Fill in the values from *Supabase → Project Settings → API Keys*:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

2. Apply the database schema in `supabase/migrations/` (Supabase CLI: `npx supabase db push`, or paste them into the SQL editor in order).

3. Load the sample data: run `supabase/seed.sql`, then upload the product images to Storage (the secret key is only needed for this step, never commit it):

   ```bash
   SUPABASE_SECRET_KEY=sb_secret_... node --env-file=.env.local scripts/sync-images.mjs
   ```

4. Start the dev server and open [http://localhost:3000](http://localhost:3000):

   ```bash
   npm run dev
   ```

<details>
<summary>Optional: demo account and type generation</summary>

**Demo account.** The *Continue with demo account* button signs in as `demo@example.com` (credentials in `src/lib/demo-data.ts`). Create this user once in `auth.users` (password hashed with `extensions.crypt(..., extensions.gen_salt('bf'))`, `email_confirmed_at = now()`) with a matching `email` row in `auth.identities`. The `protect_demo_user` trigger then keeps its email and password fixed.

**Types.** After changing the schema, regenerate `src/types/database.types.ts`:

```bash
npx supabase login
npm run db:types
```

</details>

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types and run `tsc --noEmit` |
| `npm run db:types` | Regenerate Supabase TypeScript types |

## Author

**Mahdi Golriz**, Frontend Developer · [GitHub](https://github.com/Mahdi-Golriz)
