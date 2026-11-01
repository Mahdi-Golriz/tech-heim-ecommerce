import { z } from "zod";

export const PRODUCTS_PAGE_SIZE = 12;
export const PRICE_RANGE = { min: 0, max: 2500 } as const;

export const PRODUCT_SORTS = ["newest", "price_asc", "price_desc"] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

const toNumber = (fallback: number) =>
  z.coerce.number().int().nonnegative().catch(fallback);

/**
 * Single source of truth for the product listing URL (?page=&sort=&categories=…).
 * Invalid values fall back to defaults instead of throwing, so a hand-edited
 * URL never breaks the page.
 */
export const productsSearchParamsSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  sort: z.enum(PRODUCT_SORTS).optional().catch(undefined),
  categories: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").filter(Boolean) : []))
    .catch([]),
  minPrice: toNumber(PRICE_RANGE.min).default(PRICE_RANGE.min),
  maxPrice: toNumber(PRICE_RANGE.max).default(PRICE_RANGE.max),
  onSale: z
    .string()
    .optional()
    .transform((val) => val === "true")
    .catch(false),
  q: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((val) => val || undefined)
    .catch(undefined),
});

export type ProductsSearchParams = z.output<typeof productsSearchParamsSchema>;

/** The subset the filter sidebar edits. */
export interface FilterValues {
  categories: string[];
  priceRange: [number, number];
  onSale: boolean;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

export const parseProductsSearchParams = (raw: RawSearchParams) => {
  const flat = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ])
  );
  return productsSearchParamsSchema.parse(flat);
};

export const toFilterValues = (params: ProductsSearchParams): FilterValues => ({
  categories: params.categories,
  priceRange: [params.minPrice, params.maxPrice],
  onSale: params.onSale,
});

export const hasActiveFilters = (filters: FilterValues) =>
  filters.categories.length > 0 ||
  filters.priceRange[0] > PRICE_RANGE.min ||
  filters.priceRange[1] < PRICE_RANGE.max ||
  filters.onSale;
