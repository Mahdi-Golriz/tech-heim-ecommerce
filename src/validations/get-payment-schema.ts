/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const getPaymentSchema = (t: any) => {
  return z.object({
    cardNumber: z
      .string()
      .transform((val) => val.replace(/\s/g, ""))
      .refine((val) => /^\d+$/.test(val), {
        message: t?.("cardNumber-digitsOnly"),
      })
      .refine((val) => val.length === 16, {
        message: t?.("cardNumber-length"),
      }),
    nameOnCard: z
      .string()
      .min(2, {
        message: t?.("nameOnCard-minLength"),
      })
      .regex(/^[a-zA-Z\s]+$/, {
        message: t?.("nameOnCard-lettersOnly"),
      }),
    expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, {
      message: t?.("expirationDate-format"),
    }),
    cvv: z
      .string()
      .regex(/^\d+$/, {
        message: t?.("cvv-digitsOnly"),
      })
      .refine((val) => val.length === 3 || val.length === 4, {
        message: t?.("cvv-length"),
      }),
    billingAddress: z.string().min(5, {
      message: t?.("billingAddress-minLength"),
    }),
  });
};

export type PaymentSchema = z.infer<ReturnType<typeof getPaymentSchema>>;
