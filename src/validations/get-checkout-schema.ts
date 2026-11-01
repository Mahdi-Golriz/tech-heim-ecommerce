import { z } from "zod";
import type { Translate } from "./types";

export const getCheckoutSchema = (t?: Translate) =>
  z.object({
    email: z.email({ error: t?.("email-invalid") }),
    address: z.string().trim().min(1, { error: t?.("address-required") }),
    shippingMethod: z.string().min(1),
  });

export type CheckoutSchema = z.infer<ReturnType<typeof getCheckoutSchema>>;
