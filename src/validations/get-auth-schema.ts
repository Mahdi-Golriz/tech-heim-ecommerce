/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const getSignInSchema = (t: any) => {
  return z.object({
    identifier: z.string().email({
      message: t?.("identifier-invalid"),
    }),
    password: z
      .string()
      .min(6, {
        message: t?.("password-minLength"),
      })
      .max(100, {
        message: t?.("password-maxLength"),
      }),
  });
};

export const getSignUpSchema = (t: any) => {
  return z.object({
    username: z
      .string()
      .min(3, {
        message: t?.("username-minLength"),
      })
      .max(20, {
        message: t?.("username-maxLength"),
      }),
    email: z.string().email({
      message: t?.("email-invalid"),
    }),
    password: z
      .string()
      .min(6, {
        message: t?.("password-minLength"),
      })
      .max(100, {
        message: t?.("password-maxLength"),
      }),
  });
};

export type SignInSchema = z.infer<ReturnType<typeof getSignInSchema>>;
export type SignUpSchema = z.infer<ReturnType<typeof getSignUpSchema>>;
