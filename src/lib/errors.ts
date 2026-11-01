import { isAuthError, type AuthError, type PostgrestError } from "@supabase/supabase-js";
import type { ZodError } from "zod";
import type { ActionError, ActionErrorCode } from "@/models/action-result";

/** Thrown by services; carries a stable code the UI can translate. */
export class AppError extends Error {
  constructor(
    public code: ActionErrorCode,
    message: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

const RPC_CODES: ActionErrorCode[] = [
  "NOT_AUTHENTICATED",
  "CART_EMPTY",
  "INVALID_PRODUCT",
  "INVALID_SHIPPING_METHOD",
];

/** Normalises a PostgREST error (including RAISE EXCEPTION from our RPCs). */
export const fromPostgrestError = (error: PostgrestError): AppError => {
  const code = RPC_CODES.find((c) => error.message === c) ?? "UNKNOWN";
  return new AppError(code, error.message, error);
};

const fromAuthError = (error: AuthError): ActionError => {
  switch (error.code) {
    case "invalid_credentials":
      return { code: "INVALID_CREDENTIALS", message: error.message };
    case "user_already_exists":
    case "email_exists":
      return { code: "EMAIL_TAKEN", message: error.message };
    default:
      return { code: "UNKNOWN", message: error.message };
  }
};

export const fromZodError = (error: ZodError): ActionError => ({
  code: "VALIDATION",
  message: "Invalid input",
  fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
});

/** Converts anything thrown inside a Server Action into a serialisable error. */
export const toActionError = (error: unknown): ActionError => {
  if (error instanceof AppError) return { code: error.code, message: error.message };
  if (isAuthError(error)) return fromAuthError(error);
  console.error(error);
  return { code: "UNKNOWN", message: "Something went wrong" };
};
