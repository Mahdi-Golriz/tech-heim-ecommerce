"use server";

import { z } from "zod";
import { registerUserService } from "../services/auth-service";
import { cookies } from "next/headers";

const userSchema = z.object({
  username: z.string().min(4).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function registerUserAction(prevState: any, formData: FormData) {
  const fields = {
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  };

  // Validate with Zod
  const validatedFields = userSchema.safeParse(fields);
  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  const responseData = await registerUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Failed to Register.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);

  return {
    ...prevState,
    data: fields,
  };
}
