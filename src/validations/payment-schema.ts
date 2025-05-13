import { z } from "zod";

export const PaymentSchema = z.object({
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s/g, "")) // First, remove spaces
    .refine((val) => /^\d+$/.test(val), "Card number must contain only digits") // Then check for digits
    .refine((val) => val.length === 16, "Card number must be 16 digits"),
  nameOnCard: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
  expirationDate: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/(\d{2})$/,
      "Invalid expiration date format (MM/YY)"
    ),
  cvv: z
    .string()
    .regex(/^\d+$/, "CVV must contain only digits")
    .refine(
      (val) => val.length === 3 || val.length === 4,
      "CVV must be 3 or 4 digits"
    ),
  billingAddress: z.string().min(5, "Please enter a valid billing address"),
});
