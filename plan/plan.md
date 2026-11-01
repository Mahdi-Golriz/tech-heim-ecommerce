# Tech Heim: Strapi → Supabase migration (+ Next 16 upgrade)

## Status (2026-11-01): implemented and verified

All phases are done. The live project `yafjjtherjekyyajtrbh` has:
- 6 migrations applied (recorded in `supabase_migrations.schema_migrations`);
- the seed: 6 categories, 30 products, 45 images, 3 shipping methods;
- 2 public buckets with 16 images;
- "Confirm email" turned off (`mailer_autoconfirm: true`).

`src/types/database.types.ts` is generated from the live schema.

### How it was applied
- No MCP tools were available in this session, so everything went through the **Supabase Management API**, using a personal access token (`Claude_Access_Token` in `.env.local`):
  - `POST /database/migrations` for the migrations;
  - `POST /database/query` for the seed and checks;
  - `PATCH /config/auth` for email confirmation;
  - `GET /advisors/*` for the advisors;
  - `GET /types/typescript` for the types.
- Images were uploaded with the secret key via `scripts/upload-seed-images.mjs`, which also creates the buckets if missing.
- The API assigns migration versions itself, so the local files were renamed to match the remote history (`20261101171142_catalog` … `20261101171305_document_place_order`). Remote order: catalog → profiles → rpcs → storage → commerce. `rpcs` before `commerce` is safe because plpgsql bodies are only validated when they run.

### Verification results
- `tsc`, `eslint` and `next build` all pass.
  - Home and 24 product pages are ● SSG/ISR (12 slugs × 2 locales).
  - `/products`, `/payment` and `/profile` are ƒ dynamic, by design.
- **Advisors:**
  - Security: one expected WARN, lint 0029: `place_order` is `SECURITY DEFINER`. That's intentional (it is the only writer of orders) and documented with `COMMENT ON FUNCTION` in migration `…171305`.
  - Performance: only `unused_index` INFO, expected on a database with no traffic yet.
- **RLS via SQL role impersonation: 7/7.**
  - anon reads the catalog but not carts or orders;
  - anon and users can't insert orders directly;
  - anon can't execute `place_order`;
  - an empty cart raises `CART_EMPTY`.
- **API shopping flow with 2 real users: 18/18.**
  - sign-up with immediate session; profile trigger;
  - `merge_cart` dedupes and skips invalid colours; `add_to_cart` increments and rejects unknown colours; quantity updates and removes;
  - wishlist toggle; cross-user isolation for read, delete and forged insert;
  - `place_order` rejects unknown shipping and computes totals server-side (subtotal 4116, total 3763.80); stores only `card_last4`; snapshots items; empties the cart;
  - orders are invisible to other users and can't be updated.
- **HTTP against `next start`, guest:**
  - home sections, `lang`, slug category links and Storage images;
  - PLP default, single and multi category, prefix and full-text search, onSale + max price, min price on discounted price, the 3 sorts (order verified), pagination 12/12/6, junk params;
  - PDP prerendered and on-demand, similar products, 404s;
  - checkout shipping prices from the DB;
  - redirects: no locale → `/en`, guest `/profile` → home, guest `/payment` → checkout.
- **HTTP signed in (real `@supabase/ssr` cookie):**
  - profile renders orders, total, address, email and a prefilled form;
  - wishlist tab; payment 200; other pages 200.
- Test users were deleted afterwards (cascade).

### Bugs found during verification (fixed)
- `SwitchLang` called `useSearchParams` without a Suspense boundary, which broke static prerendering. It now reads `window.location.search` in the click handler.
- `useStoreHydrated` crashed during SSR: zustand `persist` doesn't attach `.persist` when storage is unavailable, so signed-in `/payment` returned 500. The hook is now server-safe.
- The type generator types generated columns (`final_price`) as nullable; the mapper falls back to `price`.

### Not verified
- No browser was available here: clicks, optimistic UI and rollback, toasts, the Leaflet map, and the guest-cart merge triggered from the real `SessionInitializer`.
- Server Actions were not invoked over HTTP (they need the build's action ids). Their logic is thin over the RPCs verified above.

### Deviations from the original plan
- Auth runs through the browser Supabase client (`services/auth.service.ts`), not Server Actions, so `onAuthStateChange` fires immediately.
- `get_price_bounds` was dropped; the price slider uses the `PRICE_RANGE` constant (0–2500).
- The cart store is persisted for everyone; merging happens only on a guest → signed-in transition.
- Persisted stores use `skipHydration` and are rehydrated in `SessionInitializer`; `useStoreHydrated` guards the payment redirect.
- Checkout and payment share `checkout/order-summary.tsx`. The payment total previously omitted shipping.
- Default PLP sort is by rating; `newest` is explicit.

## Context

Tech Heim is a Next.js 15.1 App Router storefront (next-intl en/de, zustand, react-hook-form + zod, Tailwind 3 / shadcn). All data comes from a Strapi REST API through `src/utils/fetcher.ts` and the client hook `src/hooks/useFetch.ts`, using Strapi-specific query strings (`populate[...]`, `filters[...]`, `pagination[...]`), `documentId`s and a JWT kept in a `jwt` cookie. Strapi is being retired and replaced by the existing Supabase project (`yafjjtherjekyyajtrbh`).

**Goals:** a Postgres schema modelled on what the UI actually uses; a layered data-access architecture (models → services → server actions → hooks/components) built on `@supabase/ssr`; secure server-side handling of the cart, wishlist and order flow (RLS + RPCs); real search and filtering; an upgrade to Next 16 / React 19.2 / next-intl 4 / zod 4; and fixes for the existing bugs listed below.

**Decisions made:** sample seed data (no Strapi import) · classic ISR (no `cacheComponents`) · mock payment, hardened through a server-side order RPC · email + password auth only.

### Current-state findings (what must change)

| Area | Today (Strapi) | Files |
|---|---|---|
| Transport | `fetcher` + `useFetch` (client-side, `NEXT_PUBLIC_API_URL`) | `src/utils/fetcher.ts`, `src/hooks/useFetch.ts` |
| Auth | `/api/auth/local[/register]`, JWT in cookie, `/api/users/me?populate=…` fetched in **6 places** | `useSignin`, `useSignup`, `userInitializer.tsx`, `useAddToCart`, `useCartActions`, `useSyncCart`, `useWishlist`, `profile-orders`, `profile-wishlist` |
| Cart | `carts` + `cart-items` REST, cart created client-side after signup, merge loop of N requests | `useSyncCart.ts`, `useAddToCart.ts`, `useCartActions.ts`, `store/cart-store.ts` |
| Orders | client computes total, **stores full card number**, then deletes cart items one by one | `useSuccessPayment.ts`, `payment/index.tsx` |
| Catalog reads | Home sections + filter categories + similar products fetched client-side; PLP/PDP server-side | `new-products.tsx`, `sale-section.tsx`, `category-slider.tsx`, `products-filter.tsx`, `similar-products.tsx`, `products/page.tsx`, `products/[id]/page.tsx` |
| Filters | `filters[category][i]` (not valid Strapi syntax, so the category filter is broken), `$gt/$lt` on the **list** price | `utils/parseProductsSearchParams.ts` (+ duplicate `hooks/useProductsSearchParams.ts`) |
| Search | none (`MobileSearchInput` is never used) | `header/header.tsx` |
| Images | `getImageUrl` prefixes the Strapi URL | `utils/getImageUrl.ts`, `next.config.ts` |

### Existing bugs to fix along the way
1. `cart-store.ts`: derived totals are mutated inside `subscribe` without `set` (stale and not reactive), and `addItem`/`updateQuantity` mutate item objects in place.
2. `shopping-cart-card.tsx`: wrong discount formula `((price*100 - discount)/100)*qty`.
3. Product colours are inconsistent: `colors` (space-separated string) on cards vs `color` (array) on the PDP.
4. `useSyncCart` merge uses numeric `id`s, while every other call uses `documentId`.
5. Payment: guests "succeed" with no order created; the client sends the total; the full PAN is persisted.
6. `src/app/layout.tsx` reads `params.locale`, but the root layout has no `[locale]` param, so `<html lang>` is always undefined.
7. `middleware.ts` redirect drops the first path segment (`/products` → `/en/`) and builds a new intl middleware on every request.
8. PDP/home ISR can't work: there's no `setRequestLocale`, so next-intl falls back to headers and every page renders dynamically.
9. Hero and sidebar hardcode category IDs `1..6`.
10. List keys use `item.createdAt`; `Order.totalPrice` is typed as the literal `83.2`; `not-found.tsx` uses `next/link` instead of the i18n `Link`; dead code: `PLP/csr.tsx`, `useProductsSearchParams.ts`, `MobileSearchInput`, `google-provider-button.tsx`; unused deps `axios` and `universal-cookie` (the latter goes away with the cookie util).
11. `next@15.1.7` is affected by CVE-2025-29927 (middleware auth bypass). The Next 16 upgrade fixes it.

---

## Target architecture

```
src/
  lib/supabase/
    server.ts        createServerClient + cookies()  (RSC, actions, route handlers)
    client.ts        createBrowserClient (singleton)
    public.ts        cookie-less anon client for ISR / generateStaticParams / cached catalog reads
    proxy.ts         updateSession(request, response): refreshes the auth cookies
  types/database.types.ts      generated by Supabase (never hand-edited)
  models/            domain types (Product, ProductSummary, Category, CartItem, Order, Profile, Paginated<T>, ActionResult<T>)
  mappers/           DB row → domain model (product.mapper.ts, cart.mapper.ts, order.mapper.ts)
  services/          data access. Each fn takes a typed SupabaseClient, so it works on server AND browser
                     products.service.ts, categories.service.ts, cart.service.ts,
                     wishlist.service.ts, orders.service.ts, profile.service.ts, shipping.service.ts
  actions/           "use server": zod-validate → service/RPC → revalidate → ActionResult
                     auth.actions.ts, cart.actions.ts, wishlist.actions.ts, profile.actions.ts, order.actions.ts
  validations/       existing zod schemas (reused client + server) + products-search-params.schema.ts, place-order.schema.ts
  hooks/             thin client hooks over actions: useCart, useWishlist, useAuth, useLocationToAddress
  store/             zustand: cart (guest cache + optimistic mirror), user/session, checkout, auth-modal
  proxy.ts           next-intl middleware → supabase updateSession
supabase/
  migrations/*.sql   versioned schema (also applied via MCP)
  seed.sql
```

**Data-flow rules**
- **Public catalog reads**: Server Components → `services/*` with `public.ts` client, wrapped in `unstable_cache` with tags (`products`, `categories`); pages use `export const revalidate`. No cookies, so pages stay static/ISR.
- **User-specific reads** (profile, orders, wishlist page, payment guard): Server Components with `server.ts` client (dynamic).
- **Session hydration** (header cart/wishlist, so ISR pages stay static): a client `SessionInitializer` (replaces `UserInitializer`) uses the browser client with `onAuthStateChange`, then loads profile, cart and wishlist IDs through the same services under RLS.
- **Mutations**: always Server Actions → RPC/service. Each action returns the fresh state (e.g. the cart), the zustand store applies it, and the UI updates optimistically with rollback on error (`useTransition`).
- **Business logic in Postgres**: cart upserts/merge, order placement and price calculation run in `security definer` RPCs, so the client never sends prices.

---

## Database design (Supabase)

All tables are in `public`, have RLS enabled, and use `uuid` PKs (`gen_random_uuid()`) unless noted.

| Table | Columns (key ones) | RLS |
|---|---|---|
| `categories` | `id smallint identity`, `slug unique`, `title`, `description`, `thumbnail_path`, `position` | select: anon, authenticated |
| `products` | `id`, `slug unique`, `title`, `description`, `price numeric(10,2) check >0`, `discount_percentage smallint null check 0–90`, **`final_price` generated stored**, **`on_sale` generated stored** (`discount_percentage > 0`), `is_new bool`, `rate numeric(2,1)`, `colors text[]`, `details jsonb`, `category_id fk`, **`search_vector tsvector` generated** (title A, description B), `created_at`, `updated_at` | select: anon, authenticated |
| `product_images` | `id`, `product_id fk cascade`, `storage_path`, `alt`, `position` | select: anon, authenticated |
| `profiles` | `id uuid pk → auth.users on delete cascade`, `username`, `full_name`, `phone_number`, `address`, `postal_code`, timestamps | select/update own (`(select auth.uid()) = id`) |
| `cart_items` | `id`, `user_id → auth.users`, `product_id`, `color`, `quantity check >0`, `unique(user_id, product_id, color)` | all own |
| `wishlist_items` | `user_id`, `product_id`, `created_at`, PK(user_id, product_id) | select/insert/delete own |
| `shipping_methods` | `code text pk` (`free`/`regular`/`express`), `price numeric`, `position` | select: anon, authenticated |
| `orders` | `id`, `user_id`, `status order_status enum ('paid','cancelled')`, `email`, `subtotal`, `discount`, `shipping_method`, `shipping_cost`, `total`, `card_last4 char(4)`, `delivery_address`, `billing_address`, `created_at` | **select own only**; no insert/update policy (writes only through the RPC) |
| `order_items` | `id`, `order_id cascade`, `product_id null on delete set null`, snapshot `title`, `color`, `unit_price`, `quantity` | select where parent order is own |

No `carts` table: one cart per user is just `cart_items` keyed by `user_id`. That removes Strapi's "create cart after signup" step.

**Indexes:** `products(category_id)`, `products(final_price)`, `products(created_at desc)`, partial `products(on_sale) where on_sale`, GIN `products(search_vector)`, `product_images(product_id, position)`, `cart_items(user_id)`, `orders(user_id, created_at desc)`, `order_items(order_id)`.

**Functions / triggers** (all `set search_path = ''`):
- `handle_new_user()`: an `after insert on auth.users` trigger that creates a `profiles` row from `raw_user_meta_data.username`.
- `set_updated_at()` trigger on products/profiles.
- `add_to_cart(p_product_id, p_color, p_quantity)`: `insert … on conflict do update set quantity = quantity + excluded.quantity`, validates the colour against `products.colors`, returns the cart.
- `set_cart_item_quantity(p_item_id, p_quantity)`: deletes the row when quantity ≤ 0.
- `merge_cart(p_items jsonb)`: bulk upsert of the guest cart in one call (replaces the N-request loop).
- `place_order(p_shipping_method, p_delivery_address, p_billing_address, p_card_last4)`: `security definer`, uses `auth.uid()`, locks the cart rows, computes subtotal/discount/total from `products`, inserts the order and its items, clears the cart, returns the order id. Raises if the cart is empty.
- `get_price_bounds()` (optional, cheap): returns the min/max `final_price` so the price slider isn't hardcoded to 2000.

**Storage:** public buckets `product-images` and `category-images`. Paths go in the DB and are turned into URLs by a `getImageUrl(path, bucket)` helper (`${SUPABASE_URL}/storage/v1/object/public/...`). `next/image` gets the Supabase host in `remotePatterns`.

**Seed (`supabase/seed.sql`)**: the 6 categories matching the hero/sidebar (`mobile-phones`, `laptops`, `wearables`, `cameras`, `gaming`, `accessories`), about 30 products with realistic `details`/`colors`/discounts, shipping methods (0 / 7.5 / 22.5), and images from `src/assets/category-images` and `src/assets/new-products`, uploaded to Storage plus a few placeholder images.

---

## Package upgrades (cost-assessed)

**Include (low to moderate cost, needed or high value):**
- `next` 15.1.7 → **16.x**, `eslint-config-next` → 16 (security fix). Run `npx @next/codemod@latest upgrade latest`. Code changes: `middleware.ts` → `proxy.ts`; `next lint` removed → `"lint": "eslint ."`; Turbopack is the default (drop the `--turbopack` flag); `revalidateTag(tag, 'max')` signature; params are already awaited.
- `react`/`react-dom` → 19.2, `@types/react*` → 19.2.
- `next-intl` 3 → **4**: `hasLocale`, `setRequestLocale`, and the provider inherits messages (no more `getMessages()` prop drilling). The `request.ts` API is mostly unchanged.
- `zod` 3 → **4** + `@hookform/resolvers` → latest: switch `{ message }` to `{ error }` and `z.string().email()` to `z.email()` in the 4 schema files (mechanical).
- Patch/minor bumps: all `@radix-ui/*`, `react-hook-form`, `zustand`, `sonner`, `tailwind-merge`, `react-icons`, `typescript` 5.9, `@types/node` 22.
- **Add**: `@supabase/supabase-js`, `@supabase/ssr`, `supabase` (CLI, dev, for type generation and migrations).
- **Remove**: `axios`, `universal-cookie`.

**Defer (high cost for little value right now):** Tailwind 4 (rewrites config and shadcn tokens), Swiper 14, framer-motion → `motion` 14, lucide 1.x (icon renames), TypeScript 7, ESLint 10.

---

## Implementation TODO list (in order)

### Phase 0: Prep
- [x] 0.1 Create branch `feat/supabase-migration`.
- [x] 0.2 Add `.mcp.json` at the repo root (`mcpServers.supabase`, same URL as `.vscode/mcp.json`) so Claude Code can use the Supabase MCP (`apply_migration`, `execute_sql`, `generate_typescript_types`, `get_advisors`). `.vscode/mcp.json` is VS Code-only.
- [x] 0.3 `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; add `.env.example` (and `!.env.example` in `.gitignore`). Drop `NEXT_PUBLIC_API_URL` and `IMAGE_HOSTNAME`.
- [x] 0.4 Supabase dashboard: turn off "Confirm email" for dev, or keep it on and show a "check your inbox" state (handled in 5.2).

### Phase 1: Framework upgrade + routing fixes
- [x] 1.1 Run the Next 16 codemod; bump the packages listed above; remove `axios`; set `lint` to `eslint .` and `dev` to `next dev`.
- [x] 1.2 Rename `middleware.ts` → `src/proxy.ts`: create the intl middleware once at module scope, remove the buggy manual locale redirect (next-intl handles it), and leave a hook point for the Supabase session (3.3).
- [x] 1.3 Move `<html>/<body>` and the font into `src/app/[locale]/layout.tsx`; validate with `hasLocale` → `notFound()`; add `generateStaticParams` for the locales and call `setRequestLocale(locale)` in the layout and every page. Make `src/app/layout.tsx` a pass-through. Add `[locale]/not-found.tsx` + `[locale]/[...rest]/page.tsx` (next-intl pattern) and use the i18n `Link`.
- [x] 1.4 Migrate the zod 4 syntax in `src/validations/*`.
- [x] 1.5 Verify: `tsc --noEmit`, `eslint .`, and the dev server renders the static pages (about/faq/contact). Data pages will fail until Phase 4; that's expected.

### Phase 2: Database (via Supabase MCP, mirrored in `supabase/migrations/`)
- [x] 2.1 Migration `001_catalog`: `categories`, `products` (generated `final_price`/`on_sale`/`search_vector`), `product_images`, `shipping_methods`, indexes, RLS + public select policies.
- [x] 2.2 Migration `002_users`: `profiles`, the `handle_new_user` trigger, `set_updated_at`, RLS.
- [x] 2.3 Migration `003_commerce`: `cart_items`, `wishlist_items`, `orders`, `order_items`, the `order_status` enum, RLS (orders read-only to clients).
- [x] 2.4 Migration `rpcs`: `add_to_cart`, `set_cart_item_quantity`, `merge_cart`, `place_order`; `grant execute` to `authenticated` only (`get_price_bounds` dropped).
- [x] 2.5 Migration `005_storage`: the `product-images` and `category-images` public buckets with read policies.
- [x] 2.6 Seed: upload the images, then run `seed.sql`.
- [x] 2.7 Run `get_advisors` (security and performance) and fix every finding (missing FK indexes, `auth.uid()` wrapped in `select`, function search_path).
- [x] 2.8 Generate `src/types/database.types.ts`; add an npm script `db:types`.

### Phase 3: Supabase infrastructure in the app
- [x] 3.1 `src/lib/supabase/{server,client,public}.ts`, typed with `Database`.
- [x] 3.2 `src/lib/supabase/proxy.ts` `updateSession()` using `supabase.auth.getClaims()`.
- [x] 3.3 Chain it in `src/proxy.ts`: intl response first, then pass it to `updateSession` so the cookies are written onto the same response.
- [x] 3.4 `next.config.ts`: `remotePatterns` for `*.supabase.co/storage/v1/object/public/**`; rewrite `utils/getImageUrl.ts` to take a storage path and bucket.
- [x] 3.5 `src/lib/errors.ts`: `AppError` + `toActionError(PostgrestError | AuthError)`; `models/action-result.ts`.

### Phase 4: Models, mappers, services, catalog pages
- [x] 4.1 Rewrite `src/models/*` without Strapi fields (`documentId`, `publishedAt`, `DataResponse`): `ProductSummary` (card), `Product` (PDP, `images[]`, `colors: string[]`, `finalPrice`), `Category`, `CartItem {id, productId, color, quantity, product: ProductSummary}`, `Order`, `OrderItem`, `Profile`, `Paginated<T> {items, page, pageSize, total, totalPages}`. Keep the `CartStore`/`UserStore` types next to their stores.
- [x] 4.2 `mappers/product.mapper.ts` etc.: snake_case row → camelCase model, image path → URL, first image for cards.
- [x] 4.3 `validations/products-search-params.schema.ts`: one zod schema (`page`, `sort` ∈ `newest|price_asc|price_desc`, `categories` = slug list, `minPrice`, `maxPrice`, `onSale`, `q`) used by the PLP page **and** the client filter UI. Delete `parseProductsSearchParams.ts`, `useProductsSearchParams.ts` and `PLP/csr.tsx`; put `FilterValues` in one place.
- [x] 4.4 `products.service.ts`
  - `listProducts(client, params)`: `select(cardColumns, { count: 'exact' })`, `categories!inner(slug)` + `.in('categories.slug', slugs)`, `.gte/.lte('final_price')`, `.eq('on_sale', true)`, `.textSearch('search_vector', q, { type: 'websearch', config: 'english' })`, sort mapping (+ `id` tiebreaker), `.range()`, and `product_images` ordered by `position` with `limit(1, { referencedTable })`.
  - `getProductBySlug`, `getSimilarProducts(categoryId, excludeId, 6)`, `getNewProducts(4)`, `getSaleProducts(8)`, `listProductSlugs(12)`.
- [x] 4.5 `categories.service.ts`, `shipping.service.ts`; wrap the public reads in `unstable_cache` with tags.
- [x] 4.6 Home: turn `NewProducts`, `SaleSection` and `CategorySlider` into server wrappers that fetch data and pass props to the existing client Swiper parts. Page gets `revalidate = 3600`. Update the CTA links to the new sort/filter params.
- [x] 4.7 Hero and sidebar: use category **slugs** (`/products?categories=laptops`) instead of the hardcoded IDs.
- [x] 4.8 PLP `products/page.tsx`: parse `searchParams` with the schema → `listProducts`. Fetch categories (and price bounds) on the server and pass them to `ProductsFilter` (no more client `useFetch`). Keep `ClientInteractivity` writing to the URL; add a "Results for “q”" heading and an active-filter chip for search.
- [x] 4.9 **Search**: header search (desktop + mobile, reusing `MobileSearchInput`) built with `next/form` `<Form action={`/${locale}/products`}>` and an input named `q`, so navigation is client-side and prefetched. Add i18n keys (en/de).
- [x] 4.10 PDP: rename `products/[id]` → `products/[slug]`; `getProductBySlug` wrapped in `cache()`; `generateStaticParams` uses `public.ts` × locales; keep `revalidate = 3600`, `dynamicParams = true`; call `notFound()` instead of the inline "not found" div; fetch similar products on the server and pass them as props (`SimilarProducts` becomes presentational). Update every `/products/${documentId}` link.
- [x] 4.11 Unify the colour handling (`colors: string[]`) in `product-cart.tsx`, `sale-cart.tsx` and `PDP/index.tsx`.

### Phase 5: Auth
- [x] 5.1 `actions/auth.actions.ts`: `signIn`, `signUp` (username in `options.data`), `signOut`, each validated with the existing zod schemas server-side and returning `ActionResult`.
- [x] 5.2 Rewrite `useSignin`/`useSignup` around the actions (`useTransition`); map auth errors to i18n messages; handle the "confirmation email sent" state.
- [x] 5.3 `SessionInitializer` (replaces `user-initializer/userInitializer.tsx`): `onAuthStateChange` → load profile, cart and wishlist IDs through the services with the browser client → user and cart stores. `UserStore` holds `{ user: {id, email}, profile, wishlistIds: Set<string> }`.
- [x] 5.4 `logout-button.tsx` → `signOut` action + store reset.
- [x] 5.5 Server-side guards: `profile/page.tsx` and `payment/page.tsx` check `getClaims()` and redirect (to home with the auth modal, or to `/checkout`).
- [x] 5.6 Delete `utils/cookie.ts` and `universal-cookie`.

### Phase 6: Cart
- [x] 6.1 `cart.service.ts` (`getCart`) + `actions/cart.actions.ts` (`addToCart`, `setQuantity`, `removeItem`, `mergeGuestCart`) calling the RPCs; each returns the fresh `CartItem[]`.
- [x] 6.2 Refactor `store/cart-store.ts`: immutable updates; `setItems`; derived totals as **selectors** (`selectSubtotal`, `selectDiscount`, `selectGrandTotal`, `selectTotalItems`) computed from `finalPrice`; persist only for guests (`partialize`).
- [x] 6.3 One `hooks/useCart.ts` replacing `useAddToCart`, `useCartActions` and `useSyncCart`: guest → local store; authenticated → optimistic store update → action → reconcile/rollback + toast.
- [x] 6.4 Merge on login: after `signIn` succeeds, call `mergeGuestCart(localItems)` once, set the store, clear the guest cache.
- [x] 6.5 Update the consumers: `cart-action-buttons.tsx`, `shopping-cart-card.tsx` (fix the price formula), `cart-list.tsx`, `checkout-*`, `plp-add-to-cart.tsx`, `PDP/add-to-cart-button.tsx`, `cart-payment-details.tsx`, `shopping-cart-button.tsx`, `shopping-cart-footer.tsx`. Keys become `item.id` / `productId-color`.

### Phase 7: Wishlist
- [x] 7.1 `wishlist.service.ts` + `toggleWishlist(productId)` action (insert, or delete on conflict); returns the IDs.
- [x] 7.2 `useWishlist` with an optimistic `wishlistIds` update; `wishlist-button.tsx` reads from the store and, for guests, opens the auth modal instead of rendering nothing.

### Phase 8: Checkout, payment, orders
- [x] 8.1 The checkout page loads `shipping_methods` on the server and passes them to `Checkout`; the radio values become method **codes**; `checkout-store` keeps `shippingMethod` (code + price for display).
- [x] 8.2 `validations/place-order.schema.ts` (server): payment fields + shipping code + addresses. `actions/order.actions.ts` `placeOrder` validates, derives `card_last4`, calls the `place_order` RPC, `revalidatePath` for the profile, and returns the order id. The full PAN and CVV never leave the action.
- [x] 8.3 `payment/index.tsx`: submit → `placeOrder` → clear the cart store and checkout store → toast → `router.replace('/profile?tab=orders')`. Remove `useSuccessPayment.ts`.
- [x] 8.4 `orders.service.ts` `listOrders` (orders + `order_items`).

### Phase 9: Profile
- [x] 9.1 `profile/page.tsx` (server): fetch the profile, orders and wishlist products in parallel (`Promise.all`) and pass them to the tabs. This removes the 3 client `/users/me` calls.
- [x] 9.2 `updateProfile` action (zod `getPersonalDataSchema`, email read-only from auth) replaces `useChangePersonalData`; update `user-store` with the result.
- [x] 9.3 `profile-orders.tsx`: map to the new `Order` model (order number = short id, `card_last4`, item snapshots); add an empty state.

### Phase 10: Cleanup
- [x] 10.1 Delete `utils/fetcher.ts`, `hooks/useFetch.ts`, `models/response-model.ts`, `google-provider-button.tsx`, the Strapi leftovers; rewrite `useLocationToAddress` with a plain `fetch` to Nominatim.
- [x] 10.2 Fix the remaining lint warnings (filter debounce effect deps) and metadata ("built with Next.js and Supabase"); add the new i18n keys to both `messages/en.json` and `de.json`.
- [x] 10.3 README: setup, env vars, `db:types`, the migrations workflow.

### Phase 11: Verification
- [x] `npx tsc --noEmit`, `npm run lint`, and `npm run build`; the build output must show home and PDP as ISR/SSG (●), not dynamic (ƒ).
- [x] SQL checks via MCP `execute_sql`: as `anon`, selecting from `cart_items`/`orders` returns 0 rows; inserting into `orders` directly is denied; `place_order` with an empty cart raises.
- [x] `get_advisors` shows no security warnings.
- [x] Manual end-to-end on `npm run dev` (en and de):
  - home sections render from Supabase;
  - category links from the hero, sidebar and slider filter correctly;
  - the PLP filter, sort, pagination and search (`?q=iphone`) combine correctly;
  - the PDP renders, including similar products;
  - as a guest: add to cart, then sign up, and the cart is merged;
  - quantity changes and deletes work;
  - the wishlist toggles;
  - checkout → payment creates an order with only the last 4 digits stored, the cart is emptied, and the order appears in the profile;
  - profile edit works;
  - logout clears the state;
  - `/profile` while logged out redirects.
