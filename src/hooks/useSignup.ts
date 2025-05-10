import { useEffect, useState } from "react";
import useFetch from "./useFetch";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { setCookie } from "@/utils/cookie";
import { SigninResponse } from "@/models/response-model";
import useSyncCart from "./useSyncCart";
import { useCheckoutStore } from "@/store/checkout-store";

export const SignUpSchema = z.object({
  username: z.string().min(3).max(20, {
    message: "Username must be between 3 and 20 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
});

const useSignup = () => {
  const [openModal, setOpenModal] = useState(false);

  const { createCart, fetchUserWithMergedCart } = useSyncCart({
    setOpenModal,
  });

  const { checkoutDetails } = useCheckoutStore();
  const prefilledEmail = checkoutDetails?.email || "";

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
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
    setOpenModal(true);

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

  const signup = async (userData: z.infer<typeof SignUpSchema>) => {
    await fetchData({ body: userData });
  };

  return {
    signup,
    isSubmitting,
    data,
    error,
    form,
    openModal,
    setOpenModal,
  };
};

export default useSignup;
