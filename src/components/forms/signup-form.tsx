"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import InputIcon from "../input-with-icon/icon-input";
import { GoKey } from "react-icons/go";
import { IoMailOutline } from "react-icons/io5";
import { PiUserLight } from "react-icons/pi";

const SignUpSchema = z.object({
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

const SignUpForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // // 2. Define a submit handler.
  // const onSubmit = (values: z.infer<typeof SignInSchema>) => {
  //   // Do something with the form values.
  //   // ✅ This will be type-safe and validated.
  // };

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormControl>
              <InputIcon
                {...field}
                placeholder="Full Name"
                startIcon={PiUserLight}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormControl>
              <InputIcon
                {...field}
                placeholder="E-mail"
                startIcon={IoMailOutline}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <InputIcon
                {...field}
                placeholder="Password"
                startIcon={GoKey}
                type="password"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button className="my-6 w-full">Create Account</Button>
    </Form>
  );
};

export default SignUpForm;
