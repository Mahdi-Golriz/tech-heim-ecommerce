import { useState } from "react";
import useFetch from "./useFetch";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useUserStore } from "@/store/user-store";
import { setCookie } from "@/utils/cookie";
import { SigninResponse } from "@/models/response-model";

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

interface SignUpProps {
  onClose: VoidFunction;
}

const useSignup = ({ onClose }: SignUpProps) => {
  const [openModal, setOpenModal] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSuccessSignUp = async (response: SigninResponse) => {
    form.reset();
    setOpenModal(true);

    setCookie({ key: "jwt", value: response?.jwt });
    await createCart({
      body: {
        data: {
          user: response.user.documentId,
        },
      },
    });

    fetchUserWithCart();
  };

  const { fetchData: createCart } = useFetch({
    method: "POST",
    path: "/api/carts",
    autoFetch: false,
  });

  const { fetchData: fetchUserWithCart } = useFetch({
    path: "/api/users/me",
    autoFetch: false,
    params: { "populate[cart][populate][items][populate]": "product" },
    onSuccess: (userData) => {
      setTimeout(() => {
        setOpenModal(false);
        onClose();
        setUser(userData);
      }, 1000);
    },
  });

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
