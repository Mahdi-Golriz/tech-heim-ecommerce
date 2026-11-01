import "server-only";

import { unstable_cache } from "next/cache";
import { publicClient } from "@/lib/supabase/public";
import * as products from "@/services/products.service";
import { listCategories } from "@/services/categories.service";
import { listShippingMethods } from "@/services/shipping.service";
import type { ProductsSearchParams } from "@/validations/products-search-params.schema";

/**
 * Cached public catalog reads for Server Components. They use the cookie-less
 * client, so pages calling them can be statically rendered / ISR'd.
 * Invalidate with revalidateTag(CATALOG_TAGS.x, "max") after catalog edits.
 */
export const CATALOG_TAGS = {
  products: "products",
  categories: "categories",
  shipping: "shipping-methods",
} as const;

const HOUR = 60 * 60;

export const getCategories = unstable_cache(
  () => listCategories(publicClient),
  ["categories"],
  { tags: [CATALOG_TAGS.categories], revalidate: HOUR }
);

export const getShippingMethods = unstable_cache(
  () => listShippingMethods(publicClient),
  ["shipping-methods"],
  { tags: [CATALOG_TAGS.shipping], revalidate: HOUR }
);

export const getProducts = unstable_cache(
  (params: ProductsSearchParams) => products.listProducts(publicClient, params),
  ["products-list"],
  { tags: [CATALOG_TAGS.products], revalidate: 5 * 60 }
);

export const getProduct = unstable_cache(
  (slug: string) => products.getProductBySlug(publicClient, slug),
  ["product"],
  { tags: [CATALOG_TAGS.products], revalidate: HOUR }
);

export const getSimilarProducts = unstable_cache(
  (categoryId: number, excludeId: string) =>
    products.getSimilarProducts(publicClient, categoryId, excludeId),
  ["similar-products"],
  { tags: [CATALOG_TAGS.products], revalidate: HOUR }
);

export const getNewProducts = unstable_cache(
  () => products.getNewProducts(publicClient),
  ["new-products"],
  { tags: [CATALOG_TAGS.products], revalidate: HOUR }
);

export const getSaleProducts = unstable_cache(
  () => products.getSaleProducts(publicClient),
  ["sale-products"],
  { tags: [CATALOG_TAGS.products], revalidate: HOUR }
);

// Build-time only: not cached
export const getPrerenderSlugs = () => products.listProductSlugs(publicClient);
