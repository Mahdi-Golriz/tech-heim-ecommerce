import { z } from "zod";
import { getPaymentSchema } from "./get-payment-schema";

/** Server-side contract of the placeOrder action. */
export const placeOrderSchema = z.object({
  payment: getPaymentSchema(),
  shippingMethod: z.string().min(1),
  deliveryAddress: z.string().trim().min(1),
});

export type PlaceOrderInput = z.input<typeof placeOrderSchema>;
