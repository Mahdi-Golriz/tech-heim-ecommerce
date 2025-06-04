import { useEffect } from "react";
import useFetch from "./useFetch";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { setCookie } from "@/utils/cookie";
import { SigninResponse } from "@/models/response-model";
import useSyncCart from "./useSyncCart";
import { useCheckoutStore } from "@/store/checkout-store";
import { toast } from "sonner";
import { getSignUpSchema, SignUpSchema } from "@/validations/get-auth-schema";
import { useTranslations } from "next-intl";

const useSignup = () => {
  const { createCart, fetchUserWithMergedCart } = useSyncCart();
  const formT = useTranslations("validation.signUp");
  const t = useTranslations("authentication.signUp");
  const { checkoutDetails } = useCheckoutStore();
  const prefilledEmail = checkoutDetails?.email || "";

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(getSignUpSchema(formT)),
    defaultValues: {
      username: "",
      email: prefilledEmail || "",
      password: "",
    },
  });

  // Update email field when prefilledEmail prop changes
  useEffect(() => {
    if (prefilledEmail) {
      form.setValue("email", prefilledEmail);
    }
  }, [prefilledEmail, form]);

  const handleSuccessSignUp = async (response: SigninResponse) => {
    form.reset();

    setCookie({ key: "jwt", value: response?.jwt });

    // Create cart after sign up
    // It should be done by backend! but here, backend is Strapi
    await createCart({
      body: {
        data: {
          user: response.user.documentId,
        },
      },
    });

    // Merge the local store with backend cart and update the local stores with backend
    fetchUserWithMergedCart();
    toast.success(t("successfulSignUpToast"));
  };

  const {
    data,
    isLoading: isSubmitting,
    error,
    fetchData,
  } = useFetch<SigninResponse>({
    needToken: false,
    path: "/api/auth/local/register",
    method: "POST",
    autoFetch: false,
    onSuccess: handleSuccessSignUp,
  });

  const signup = async (userData: SignUpSchema) => {
    await fetchData({ body: userData });
  };

  return {
    signup,
    isSubmitting,
    data,
    error,
    form,
  };
};

export default useSignup;
