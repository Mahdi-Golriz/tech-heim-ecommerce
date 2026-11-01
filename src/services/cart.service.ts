import type { TypedSupabaseClient } from "@/lib/supabase/types";
import { fromPostgrestError } from "@/lib/errors";
import { toCartItems } from "@/mappers/cart.mapper";
import type { CartItem } from "@/models/cart-model";

const CART_SELECT =
  "id, product_id, color, quantity, product:products(id, slug, title, price, final_price, discount_percentage, rate, colors, is_new, images:product_images(id, storage_path, alt, position))" as const;

/** The signed-in user's cart (RLS scopes rows to auth.uid()). */
export const getCart = async (client: TypedSupabaseClient): Promise<CartItem[]> => {
  const { data, error } = await client
    .from("cart_items")
    .select(CART_SELECT)
    .order("created_at")
    .order("position", { referencedTable: "product.images" })
    .limit(1, { referencedTable: "product.images" });

  if (error) throw fromPostgrestError(error);
  return toCartItems(data);
};

export const addToCart = async (
  client: TypedSupabaseClient,
  productId: string,
  color: string,
  quantity: number
) => {
  const { error } = await client.rpc("add_to_cart", {
    p_product_id: productId,
    p_color: color,
    p_quantity: quantity,
  });
  if (error) throw fromPostgrestError(error);
};

export const setCartItemQuantity = async (
  client: TypedSupabaseClient,
  itemId: string,
  quantity: number
) => {
  const { error } = await client.rpc("set_cart_item_quantity", {
    p_item_id: itemId,
    p_quantity: quantity,
  });
  if (error) throw fromPostgrestError(error);
};

export interface GuestCartLine {
  productId: string;
  color: string;
  quantity: number;
}

export const mergeCart = async (client: TypedSupabaseClient, lines: GuestCartLine[]) => {
  if (!lines.length) return;
  const { error } = await client.rpc("merge_cart", {
    p_items: lines.map((line) => ({
      product_id: line.productId,
      color: line.color,
      quantity: line.quantity,
    })),
  });
  if (error) throw fromPostgrestError(error);
};
