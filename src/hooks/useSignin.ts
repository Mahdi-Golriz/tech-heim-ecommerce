/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import useFetch from "./useFetch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserStore } from "@/store/user-store";
import { setCookie } from "@/utils/cookie";

interface SignInProps {
  onClose: VoidFunction;
}

interface StrapiResponse {
  user: any;
  jwt: string;
}

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

const useSignin = ({ onClose }: SignInProps) => {
  const [openModal, setOpenModal] = useState(false);

  const setUser = useUserStore((state) => state.setUser);

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleSuccessSignUp = (response: StrapiResponse) => {
    form.reset();
    setOpenModal(true);
    setTimeout(() => {
      setOpenModal(false);
      onClose();
    }, 1000);

    setUser(response.user);
    setCookie({ key: "jwt", value: response?.jwt });
  };

  const { data, error, fetchData, isLoading } = useFetch({
    path: "/api/auth/local",
    method: "POST",
    autoFetch: false,
    onSuccess: handleSuccessSignUp,
  });

  const signin = (userData: z.infer<typeof SignInSchema>) => {
    fetchData({ body: userData });
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
