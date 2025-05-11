import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "@/utils/cookie";
import { SigninResponse } from "@/models/response-model";
import useSyncCart from "./useSyncCart";
import { useCheckoutStore } from "@/store/checkout-store";

export const SignInSchema = z.object({
  identifier: z
    .string()
    .min(3, {
      message: "Identifier must have at least 3 or more characters",
    })
    .email({
      message: "Please enter a valid username or email address",
    }),
  password: z
    .string()
    .min(6, {
      message: "Password must have at least 6 or more characters",
    })
    .max(100, {
      message: "Password must be between 6 and 100 characters",
    }),
});

const useSignin = () => {
  const [openModal, setOpenModal] = useState(false);
  const { checkoutDetails } = useCheckoutStore();
  const prefilledEmail = checkoutDetails?.email || "";
  const { fetchUserWithMergedCart } = useSyncCart({ setOpenModal });

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
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
    setOpenModal(true);
    setCookie({ key: "jwt", value: response?.jwt });

    // Merge the local store with backend cart and update the local stores with backend
    await fetchUserWithMergedCart();
  };

  const { data, error, fetchData, isLoading } = useFetch({
    needToken: false,
    path: "/api/auth/local",
    method: "POST",
    autoFetch: false,
    onSuccess: handleSuccessSignUp,
  });

  const signin = async (userData: z.infer<typeof SignInSchema>) => {
    await fetchData({ body: userData });
  };

  return {
    signin,
    isLoading,
    data,
    error,
    form,
    openModal,
    setOpenModal,
  };
};

export default useSignin;
