import type { Tables } from "@/types/database.types";
import type { Order, ShippingMethod } from "@/models/order-model";

export type OrderRow = Omit<Tables<"orders">, "user_id" | "email" | "billing_address"> & {
  items: Pick<
    Tables<"order_items">,
    "id" | "product_id" | "title" | "color" | "unit_price" | "quantity"
  >[];
};

export const toOrder = (row: OrderRow): Order => ({
  id: row.id,
  number: row.id.slice(0, 8).toUpperCase(),
  status: row.status,
  subtotal: Number(row.subtotal),
  discount: Number(row.discount),
  shippingMethod: row.shipping_method,
  shippingCost: Number(row.shipping_cost),
  total: Number(row.total),
  cardLast4: row.card_last4,
  deliveryAddress: row.delivery_address,
  createdAt: row.created_at,
  items: row.items.map((item) => ({
    id: item.id,
    productId: item.product_id,
    title: item.title,
    color: item.color,
    unitPrice: Number(item.unit_price),
    quantity: item.quantity,
  })),
});

export const toShippingMethod = (
  row: Pick<Tables<"shipping_methods">, "code" | "price">
): ShippingMethod => ({ code: row.code, price: Number(row.price) });
