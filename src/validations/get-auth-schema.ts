import { z } from "zod";
import type { Translate } from "./types";

export const getSignInSchema = (t?: Translate) =>
  z.object({
    identifier: z.email({ error: t?.("identifier-invalid") }),
    password: z
      .string()
      .min(6, { error: t?.("password-minLength") })
      .max(100, { error: t?.("password-maxLength") }),
  });

export const getSignUpSchema = (t?: Translate) =>
  z.object({
    username: z
      .string()
      .trim()
      .min(3, { error: t?.("username-minLength") })
      .max(20, { error: t?.("username-maxLength") }),
    email: z.email({ error: t?.("email-invalid") }),
    password: z
      .string()
      .min(6, { error: t?.("password-minLength") })
      .max(100, { error: t?.("password-maxLength") }),
  });

export type SignInSchema = z.infer<ReturnType<typeof getSignInSchema>>;
export type SignUpSchema = z.infer<ReturnType<typeof getSignUpSchema>>;
