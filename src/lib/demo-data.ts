import type { SignInSchema } from "@/validations/get-auth-schema";
import type { PaymentFormValues } from "@/validations/get-payment-schema";

/**
 * Public demo account so visitors can try the app without signing up.
 * Its email and password are locked by the protect_demo_user trigger.
 */
export const DEMO_USER: SignInSchema = {
  identifier: "demo@example.com",
  password: "TechHeimDemo2026",
};

/** Test card for the payment form; no real payment is processed. */
export const DEMO_PAYMENT = {
  cardNumber: "4242 4242 4242 4242",
  nameOnCard: "Demo User",
  expirationDate: "12/30",
  cvv: "123",
} satisfies Omit<PaymentFormValues, "billingAddress">;
