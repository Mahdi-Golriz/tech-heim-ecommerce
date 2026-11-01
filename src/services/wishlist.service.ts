import type { TypedSupabaseClient } from "@/lib/supabase/types";
import { fromPostgrestError } from "@/lib/errors";
import { toProductSummary } from "@/mappers/product.mapper";
import type { ProductSummary } from "@/models/product-model";

export const getWishlistIds = async (client: TypedSupabaseClient): Promise<string[]> => {
  const { data, error } = await client.from("wishlist_items").select("product_id");

  if (error) throw fromPostgrestError(error);
  return data.map((row) => row.product_id);
};

export const getWishlistProducts = async (
  client: TypedSupabaseClient
): Promise<ProductSummary[]> => {
  const { data, error } = await client
    .from("wishlist_items")
    .select(
      "product:products(id, slug, title, price, final_price, discount_percentage, rate, colors, is_new, images:product_images(id, storage_path, alt, position))"
    )
    .order("created_at", { ascending: false })
    .order("position", { referencedTable: "product.images" })
    .limit(1, { referencedTable: "product.images" });

  if (error) throw fromPostgrestError(error);
  return data.flatMap((row) => (row.product ? [toProductSummary(row.product)] : []));
};

/** Adds the product, or removes it if it is already wishlisted. Returns the new state. */
export const toggleWishlistItem = async (
  client: TypedSupabaseClient,
  userId: string,
  productId: string
): Promise<boolean> => {
  const { data: removed, error: deleteError } = await client
    .from("wishlist_items")
    .delete()
    .eq("product_id", productId)
    .select("product_id");

  if (deleteError) throw fromPostgrestError(deleteError);
  if (removed.length) return false;

  const { error } = await client
    .from("wishlist_items")
    .insert({ user_id: userId, product_id: productId });

  if (error) throw fromPostgrestError(error);
  return true;
};
