"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { IoMailOutline } from "react-icons/io5";
import { GoKey } from "react-icons/go";

import Button from "../ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import InputIcon from "../input-with-icon/icon-input";

const SignInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
});

const SignInForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
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

      <Button className="my-6 w-full">Log In</Button>
    </Form>
  );
};

export default SignInForm;
