import type { TypedSupabaseClient } from "@/lib/supabase/types";
import { fromPostgrestError } from "@/lib/errors";
import { toProduct, toProductSummary } from "@/mappers/product.mapper";
import type { Paginated, Product, ProductSummary } from "@/models/product-model";
import {
  PRICE_RANGE,
  PRODUCTS_PAGE_SIZE,
  type ProductsSearchParams,
} from "@/validations/products-search-params.schema";

const LIST_SELECT =
  "id, slug, title, price, final_price, discount_percentage, rate, colors, is_new, images:product_images(id, storage_path, alt, position), category:categories!inner(slug)" as const;

const DETAIL_SELECT =
  "id, slug, title, description, details, price, final_price, discount_percentage, rate, colors, is_new, images:product_images(id, storage_path, alt, position), category:categories(id, slug, title)" as const;

// Characters with meaning in PostgREST filter syntax
const sanitizeSearch = (q: string) => q.replace(/[,()"\\%*:]/g, " ").trim();

/** Product listing with filters, search, sorting and pagination. */
export const listProducts = async (
  client: TypedSupabaseClient,
  params: ProductsSearchParams
): Promise<Paginated<ProductSummary>> => {
  const { page, sort, categories, minPrice, maxPrice, onSale, q } = params;
  const from = (page - 1) * PRODUCTS_PAGE_SIZE;

  let query = client
    .from("products")
    .select(LIST_SELECT, { count: "exact" })
    // only the cover image for cards
    .order("position", { referencedTable: "images" })
    .limit(1, { referencedTable: "images" });

  if (categories.length) query = query.in("category.slug", categories);
  if (minPrice > PRICE_RANGE.min) query = query.gte("final_price", minPrice);
  if (maxPrice < PRICE_RANGE.max) query = query.lte("final_price", maxPrice);
  if (onSale) query = query.eq("on_sale", true);

  const search = q ? sanitizeSearch(q) : "";
  if (search) {
    // Stemmed full-text match OR prefix-friendly title match ("iph" → iPhone)
    query = query.or(
      `search_vector.wfts(english)."${search}",title.ilike."%${search}%"`
    );
  }

  switch (sort) {
    case "price_asc":
      query = query.order("final_price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("final_price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("rate", { ascending: false, nullsFirst: false });
  }

  const { data, count, error } = await query
    .order("id") // stable pagination
    .range(from, from + PRODUCTS_PAGE_SIZE - 1);

  if (error) throw fromPostgrestError(error);

  const total = count ?? 0;
  return {
    items: data.map(toProductSummary),
    page,
    pageSize: PRODUCTS_PAGE_SIZE,
    total,
    totalPages: Math.max(1, Math.ceil(total / PRODUCTS_PAGE_SIZE)),
  };
};

export const getProductBySlug = async (
  client: TypedSupabaseClient,
  slug: string
): Promise<Product | null> => {
  const { data, error } = await client
    .from("products")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw fromPostgrestError(error);
  return data ? toProduct(data) : null;
};

const SUMMARY_SELECT =
  "id, slug, title, price, final_price, discount_percentage, rate, colors, is_new, images:product_images(id, storage_path, alt, position)" as const;

const summaries = (client: TypedSupabaseClient) =>
  client
    .from("products")
    .select(SUMMARY_SELECT)
    .order("position", { referencedTable: "images" })
    .limit(1, { referencedTable: "images" });

export const getSimilarProducts = async (
  client: TypedSupabaseClient,
  categoryId: number,
  excludeId: string,
  limit = 6
): Promise<ProductSummary[]> => {
  const { data, error } = await summaries(client)
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .order("rate", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw fromPostgrestError(error);
  return data.map(toProductSummary);
};

export const getNewProducts = async (
  client: TypedSupabaseClient,
  limit = 4
): Promise<ProductSummary[]> => {
  const { data, error } = await summaries(client)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw fromPostgrestError(error);
  return data.map(toProductSummary);
};

export const getSaleProducts = async (
  client: TypedSupabaseClient,
  limit = 8
): Promise<ProductSummary[]> => {
  const { data, error } = await summaries(client)
    .eq("on_sale", true)
    .order("discount_percentage", { ascending: false })
    .limit(limit);

  if (error) throw fromPostgrestError(error);
  return data.map(toProductSummary);
};

/** Slugs to prerender at build time (the rest are generated on demand). */
export const listProductSlugs = async (
  client: TypedSupabaseClient,
  limit = PRODUCTS_PAGE_SIZE
): Promise<string[]> => {
  const { data, error } = await client
    .from("products")
    .select("slug")
    .order("rate", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw fromPostgrestError(error);
  return data.map((row) => row.slug);
};
