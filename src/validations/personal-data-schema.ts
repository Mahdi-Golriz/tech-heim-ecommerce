import { z } from "zod";

export const personalDataSchema = z.object({
  fullName: z
    .string()
    .transform((val) => val.trim())
    .refine(
      (val) => val === "" || val.length >= 2,
      "Full name must be at least 2 characters"
    )
    .refine(
      (val) => val === "" || val.length <= 50,
      "Full name must not exceed 50 characters"
    )
    .refine(
      (val) => val === "" || /^[a-zA-Z\s]+$/.test(val),
      "Full name should only contain letters and spaces"
    )
    .optional(),

  email: z
    .string()
    .transform((val) => val.trim())
    .refine(
      (val) => val === "" || z.string().email().safeParse(val).success,
      "Please enter a valid email address"
    )
    .optional(),

  phoneNumber: z
    .string()
    .transform((val) => val.trim())
    .refine(
      (val) => val === "" || val.length >= 10,
      "Phone number must be at least 10 digits"
    )
    .refine(
      (val) => val === "" || val.length <= 15,
      "Phone number must not exceed 15 digits"
    )
    .refine(
      (val) => val === "" || /^[\d\s\-\+\(\)]+$/.test(val),
      "Please enter a valid phone number"
    )
    .optional(),

  address: z
    .string()
    .transform((val) => val.trim())
    .refine(
      (val) => val === "" || val.length >= 5,
      "Address must be at least 5 characters"
    )
    .refine(
      (val) => val === "" || val.length <= 100,
      "Address must not exceed 100 characters"
    )
    .optional(),

  postalCode: z
    .string()
    .transform((val) => val.trim())
    .refine(
      (val) => val === "" || val.length >= 3,
      "Postal code must be at least 3 characters"
    )
    .refine(
      (val) => val === "" || val.length <= 10,
      "Postal code must not exceed 10 characters"
    )
    .refine(
      (val) => val === "" || /^[A-Za-z0-9\s\-]+$/.test(val),
      "Please enter a valid postal code"
    )
    .optional(),
});
