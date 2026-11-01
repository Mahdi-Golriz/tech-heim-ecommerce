"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { toActionError } from "@/lib/errors";
import { signUp } from "@/services/auth.service";
import { useCheckoutStore } from "@/store/checkout-store";
import useAuthModalStore from "@/store/auth-modal-store";
import { getSignUpSchema, SignUpSchema } from "@/validations/get-auth-schema";
import useActionError from "./useActionError";

const useSignup = () => {
  const formT = useTranslations("validation.signUp");
  const t = useTranslations("authentication.signUp");
  const actionError = useActionError();
  const closeAuthModal = useAuthModalStore((s) => s.closeAuthModal);
  const prefilledEmail = useCheckoutStore((s) => s.checkoutDetails?.email) || "";
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [isSubmitting, startTransition] = useTransition();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(getSignUpSchema(formT)),
    defaultValues: { username: "", email: prefilledEmail, password: "" },
  });

  useEffect(() => {
    if (prefilledEmail) form.setValue("email", prefilledEmail);
  }, [prefilledEmail, form]);

  const signup = (data: SignUpSchema) => {
    setError(null);
    startTransition(async () => {
      try {
        // Profile row is created by the handle_new_user DB trigger
        const { needsConfirmation } = await signUp(createClient(), data);
        form.reset();
        if (needsConfirmation) {
          setConfirmationSent(true);
          return;
        }
        closeAuthModal();
        toast.success(t("successfulSignUpToast"));
      } catch (err) {
        setError(actionError(toActionError(err)));
      }
    });
  };

  return { signup, isSubmitting, error, confirmationSent, form };
};

export default useSignup;
