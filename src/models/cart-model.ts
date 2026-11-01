import type { ProductSummary } from "./product-model";

export interface CartItem {
  /** DB row id for signed-in users, `${productId}:${color}` for guests. */
  id: string;
  productId: string;
  color: string;
  quantity: number;
  product: ProductSummary;
}

export const guestCartItemId = (productId: string, color: string) =>
  `${productId}:${color}`;
