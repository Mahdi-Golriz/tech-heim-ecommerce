export type ActionErrorCode =
  | "VALIDATION"
  | "NOT_AUTHENTICATED"
  | "INVALID_CREDENTIALS"
  | "EMAIL_TAKEN"
  | "CART_EMPTY"
  | "INVALID_PRODUCT"
  | "INVALID_SHIPPING_METHOD"
  | "UNKNOWN";

export interface ActionError {
  code: ActionErrorCode;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: ActionError };

export const ok = <T>(data: T): ActionResult<T> => ({ ok: true, data });
export const fail = (error: ActionError): ActionResult<never> => ({
  ok: false,
  error,
});
