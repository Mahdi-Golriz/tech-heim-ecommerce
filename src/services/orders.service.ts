import type { TypedSupabaseClient } from "@/lib/supabase/types";
import { fromPostgrestError } from "@/lib/errors";
import { toOrder } from "@/mappers/order.mapper";
import type { Order } from "@/models/order-model";

export const listOrders = async (client: TypedSupabaseClient): Promise<Order[]> => {
  const { data, error } = await client
    .from("orders")
    .select(
      "id, status, subtotal, discount, shipping_method, shipping_cost, total, card_last4, delivery_address, created_at, items:order_items(id, product_id, title, color, unit_price, quantity)"
    )
    .order("created_at", { ascending: false });

  if (error) throw fromPostgrestError(error);
  return data.map(toOrder);
};

export interface PlaceOrderParams {
  shippingMethod: string;
  deliveryAddress: string;
  billingAddress: string;
  cardLast4: string;
}

/** Turns the caller's cart into an order inside one database transaction. */
export const placeOrder = async (
  client: TypedSupabaseClient,
  params: PlaceOrderParams
): Promise<string> => {
  const { data, error } = await client.rpc("place_order", {
    p_shipping_method: params.shippingMethod,
    p_delivery_address: params.deliveryAddress,
    p_billing_address: params.billingAddress,
    p_card_last4: params.cardLast4,
  });

  if (error) throw fromPostgrestError(error);
  return data;
};
