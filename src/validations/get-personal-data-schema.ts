import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPersonalDataSchema = (t: any) => {
  return z.object({
    fullName: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val === "" || val.length >= 2, t?.("fullName-minLength"))
      .refine(
        (val) => val === "" || val.length <= 50,
        t?.("fullName-maxLength")
      )
      .refine(
        (val) => val === "" || /^[a-zA-Z\s]+$/.test(val),
        t?.("fullName-pattern")
      )
      .optional(),

    email: z
      .string()
      .transform((val) => val.trim())
      .refine(
        (val) => val === "" || z.string().email().safeParse(val).success,
        t?.("email-invalid")
      )
      .optional(),

    phoneNumber: z
      .string()
      .transform((val) => val.trim())
      .refine(
        (val) => val === "" || val.length >= 10,
        t?.("phoneNumber-minLength")
      )
      .refine(
        (val) => val === "" || val.length <= 15,
        t?.("phoneNumber-maxLength")
      )
      .refine(
        (val) => val === "" || /^[\d\s\-\+\(\)]+$/.test(val),
        t?.("phoneNumber-pattern")
      )
      .optional(),

    address: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val === "" || val.length >= 5, t?.("address-minLength"))
      .refine(
        (val) => val === "" || val.length <= 100,
        t?.("address-maxLength")
      )
      .optional(),

    postalCode: z
      .string()
      .transform((val) => val.trim())
      .refine(
        (val) => val === "" || val.length >= 3,
        t?.("postalCode-minLength")
      )
      .refine(
        (val) => val === "" || val.length <= 10,
        t?.("postalCode-maxLength")
      )
      .refine(
        (val) => val === "" || /^[A-Za-z0-9\s\-]+$/.test(val),
        t?.("postalCode-pattern")
      )
      .optional(),
  });
};

export type PersonalDataSchema = z.infer<
  ReturnType<typeof getPersonalDataSchema>
>;
