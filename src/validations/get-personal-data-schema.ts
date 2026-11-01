import { z } from "zod";
import type { Translate } from "./types";

const optionalText = () => z.string().transform((val) => val.trim());

export const getPersonalDataSchema = (t?: Translate) =>
  z.object({
    fullName: optionalText()
      .refine((val) => val === "" || val.length >= 2, t?.("fullName-minLength"))
      .refine((val) => val === "" || val.length <= 50, t?.("fullName-maxLength"))
      .refine(
        (val) => val === "" || /^[a-zA-Z\s]+$/.test(val),
        t?.("fullName-pattern")
      )
      .optional(),

    // Read-only in the form: the email belongs to Supabase Auth, not the profile.
    email: z.string().optional(),

    phoneNumber: optionalText()
      .refine((val) => val === "" || val.length >= 10, t?.("phoneNumber-minLength"))
      .refine((val) => val === "" || val.length <= 15, t?.("phoneNumber-maxLength"))
      .refine(
        (val) => val === "" || /^[\d\s\-\+\(\)]+$/.test(val),
        t?.("phoneNumber-pattern")
      )
      .optional(),

    address: optionalText()
      .refine((val) => val === "" || val.length >= 5, t?.("address-minLength"))
      .refine((val) => val === "" || val.length <= 100, t?.("address-maxLength"))
      .optional(),

    postalCode: optionalText()
      .refine((val) => val === "" || val.length >= 3, t?.("postalCode-minLength"))
      .refine((val) => val === "" || val.length <= 10, t?.("postalCode-maxLength"))
      .refine(
        (val) => val === "" || /^[A-Za-z0-9\s\-]+$/.test(val),
        t?.("postalCode-pattern")
      )
      .optional(),
  });

export type PersonalDataFormValues = z.input<ReturnType<typeof getPersonalDataSchema>>;
export type PersonalDataSchema = z.output<ReturnType<typeof getPersonalDataSchema>>;
