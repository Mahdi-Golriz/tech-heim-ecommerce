import type { Tables } from "@/types/database.types";
import type { CartItem } from "@/models/cart-model";
import { toProductSummary, type ProductSummaryRow } from "./product.mapper";

export type CartItemRow = Pick<
  Tables<"cart_items">,
  "id" | "product_id" | "color" | "quantity"
> & { product: ProductSummaryRow | null };

export const toCartItems = (rows: CartItemRow[]): CartItem[] =>
  rows
    // a product deleted from the catalog cascades, but guard anyway
    .filter((row): row is CartItemRow & { product: ProductSummaryRow } => !!row.product)
    .map((row) => ({
      id: row.id,
      productId: row.product_id,
      color: row.color,
      quantity: row.quantity,
      product: toProductSummary(row.product),
    }));
