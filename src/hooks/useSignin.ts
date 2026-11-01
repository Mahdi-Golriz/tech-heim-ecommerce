"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { DEMO_USER } from "@/lib/demo-data";
import { toActionError } from "@/lib/errors";
import { signIn } from "@/services/auth.service";
import { useCheckoutStore } from "@/store/checkout-store";
import useAuthModalStore from "@/store/auth-modal-store";
import { getSignInSchema, SignInSchema } from "@/validations/get-auth-schema";
import useActionError from "./useActionError";

const useSignin = () => {
  const formT = useTranslations("validation.signIn");
  const t = useTranslations("authentication.signIn");
  const actionError = useActionError();
  const closeAuthModal = useAuthModalStore((s) => s.closeAuthModal);
  const prefilledEmail = useCheckoutStore((s) => s.checkoutDetails?.email) || "";
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(getSignInSchema(formT)),
    defaultValues: { identifier: prefilledEmail, password: "" },
  });

  // Prefill from the checkout email when available
  useEffect(() => {
    if (prefilledEmail) form.setValue("identifier", prefilledEmail);
  }, [prefilledEmail, form]);

  const signin = (data: SignInSchema) => {
    setError(null);
    startTransition(async () => {
      try {
        await signIn(createClient(), data);
        // SessionInitializer picks up SIGNED_IN, merges the guest cart and loads user data
        form.reset();
        closeAuthModal();
        toast.success(t("successfulLoginToast"));
      } catch (err) {
        setError(actionError(toActionError(err)));
      }
    });
  };

  const signinAsDemo = () => signin(DEMO_USER);

  return { signin, signinAsDemo, isLoading, error, form };
};

export default useSignin;
