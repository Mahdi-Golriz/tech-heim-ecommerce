"use server";

import { revalidatePath } from "next/cache";
import { fail, ok, type ActionResult } from "@/models/action-result";
import { fromZodError, toActionError } from "@/lib/errors";
import { placeOrder } from "@/services/orders.service";
import {
  placeOrderSchema,
  type PlaceOrderInput,
} from "@/validations/place-order.schema";
import { requireUser } from "./helpers";

/**
 * Mock payment: the card is validated here and only its last 4 digits are
 * stored. Totals are computed by the place_order RPC from catalog prices.
 */
export const placeOrderAction = async (
  input: PlaceOrderInput
): Promise<ActionResult<{ orderId: string }>> => {
  const parsed = placeOrderSchema.safeParse(input);
  if (!parsed.success) return fail(fromZodError(parsed.error));

  try {
    const { supabase } = await requireUser();
    const { payment, shippingMethod, deliveryAddress } = parsed.data;

    const orderId = await placeOrder(supabase, {
      shippingMethod,
      deliveryAddress,
      billingAddress: payment.billingAddress,
      cardLast4: payment.cardNumber.slice(-4),
    });

    revalidatePath("/[locale]/profile", "page");
    return ok({ orderId });
  } catch (error) {
    return fail(toActionError(error));
  }
};
