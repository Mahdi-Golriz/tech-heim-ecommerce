import type { TypedSupabaseClient } from "@/lib/supabase/types";
import { fromPostgrestError } from "@/lib/errors";
import { toShippingMethod } from "@/mappers/order.mapper";
import type { ShippingMethod } from "@/models/order-model";

export const listShippingMethods = async (
  client: TypedSupabaseClient
): Promise<ShippingMethod[]> => {
  const { data, error } = await client
    .from("shipping_methods")
    .select("code, price")
    .order("position");

  if (error) throw fromPostgrestError(error);
  return data.map(toShippingMethod);
};
