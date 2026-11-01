import { z } from "zod";
import type { Translate } from "./types";

export const getPaymentSchema = (t?: Translate) =>
  z.object({
    cardNumber: z
      .string()
      .transform((val) => val.replace(/\s/g, ""))
      .refine((val) => /^\d+$/.test(val), {
        error: t?.("cardNumber-digitsOnly"),
      })
      .refine((val) => val.length === 16, {
        error: t?.("cardNumber-length"),
      }),
    nameOnCard: z
      .string()
      .min(2, { error: t?.("nameOnCard-minLength") })
      .regex(/^[a-zA-Z\s]+$/, { error: t?.("nameOnCard-lettersOnly") }),
    expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, {
      error: t?.("expirationDate-format"),
    }),
    cvv: z
      .string()
      .regex(/^\d+$/, { error: t?.("cvv-digitsOnly") })
      .refine((val) => val.length === 3 || val.length === 4, {
        error: t?.("cvv-length"),
      }),
    billingAddress: z
      .string()
      .trim()
      .min(5, { error: t?.("billingAddress-minLength") }),
  });

/** z.input: what the form holds (card number may still contain spaces). */
export type PaymentFormValues = z.input<ReturnType<typeof getPaymentSchema>>;
export type PaymentSchema = z.output<ReturnType<typeof getPaymentSchema>>;
