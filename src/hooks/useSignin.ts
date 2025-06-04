import { useEffect } from "react";
import useFetch from "./useFetch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "@/utils/cookie";
import { SigninResponse } from "@/models/response-model";
import useSyncCart from "./useSyncCart";
import { useCheckoutStore } from "@/store/checkout-store";
import { toast } from "sonner";
import { getSignInSchema, SignInSchema } from "@/validations/get-auth-schema";
import { useTranslations } from "next-intl";

const useSignin = () => {
  const formT = useTranslations("validation.signIn");
  const t = useTranslations("authentication.signIn");
  const { checkoutDetails } = useCheckoutStore();
  const prefilledEmail = checkoutDetails?.email || "";
  const { fetchUserWithMergedCart } = useSyncCart();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(getSignInSchema(formT)),
    defaultValues: {
      identifier: prefilledEmail || "",
      password: "",
    },
  });

  // Update email field when prefilledEmail prop changes
  useEffect(() => {
    if (prefilledEmail) {
      form.setValue("identifier", prefilledEmail);
    }
  }, [prefilledEmail, form]);

  const handleSuccessSignUp = async (response: SigninResponse) => {
    form.reset();
    setCookie({ key: "jwt", value: response?.jwt });

    // Merge the local store with backend cart and update the local stores with backend
    await fetchUserWithMergedCart();
    toast.success(t("successfulLoginToast"));
  };

  const { data, error, fetchData, isLoading } = useFetch({
    needToken: false,
    path: "/api/auth/local",
    method: "POST",
    autoFetch: false,
    onSuccess: handleSuccessSignUp,
  });

  const signin = async (userData: SignInSchema) => {
    await fetchData({ body: userData });
  };

  return {
    signin,
    isLoading,
    data,
    error,
    form,
  };
};

export default useSignin;
