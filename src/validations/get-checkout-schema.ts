import { z } from "zod";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getCheckoutSchema = (t: any) => {
  return z.object({
    email: z.string().email({
      message: t?.("email-invalid"),
    }),
    address: z.string().min(1, {
      message: t?.("address-required"),
    }),
    shippingCost: z.string(),
  });
};

export type CheckoutSchema = z.infer<ReturnType<typeof getCheckoutSchema>>;
