/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const handleSuccessSignUp = (response: SigninResponse) => {
    form.reset();
    setOpenModal(true);
    setTimeout(() => {
      setOpenModal(false);
      onClose();
      setUser(response.user);
    }, 1000);

    setCookie({ key: "jwt", value: response?.jwt });
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
