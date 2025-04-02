/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import useFetch from "./useFetch";
import { setCookie } from "cookies-next";

type StrapiError = { status: number; name: string; message: string };

interface StrapiResponse {
  error?: StrapiError;
  data?: any;
  user?: any;
  jwt?: string;
}

interface RegisterUserProps {
  username: string;
  password: string;
  email: string;
}

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain:
    typeof window !== "undefined" ? window.location.hostname : "localhost",
  // httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const useSignup = () => {
  const [formData, setFormDta] = useState<RegisterUserProps | null>(null);
  const [strapiError, setStrapiError] = useState("");

  const {
    data,
    isLoading: isSubmitting,
    error,
    refetch,
  } = useFetch<StrapiResponse>({
    path: "/api/auth/local/register",
    method: "POST",
    body: formData,
    autoFetch: false,
  });

  if (data?.error) {
    setStrapiError(data.error.message);
  }

  if (data?.jwt) {
    // Use cookies-next package for client-side cookie handling
    setCookie("jwt", data.jwt, cookieConfig);
    console.log(data.jwt);
  }

  const signup = (userData: RegisterUserProps) => {
    setFormDta(userData);
    setStrapiError("");
    refetch();
  };

  return {
    signup,
    isSubmitting,
    data,
    error,
    strapiError,
  };
};

export default useSignup;
