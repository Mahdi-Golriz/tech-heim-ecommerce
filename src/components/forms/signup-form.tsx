"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { registerUserAction } from "@/app/data/actions/auth-actions";
import { startTransition, useActionState, useEffect, useState } from "react";
import { SubmitButton } from "./submit-button";
import { useRouter } from "@/i18n/routing";

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

// Initial state for server action
const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  data: null,
  message: null,
};

const SignUpForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // Server action state
  const [formState, formAction] = useActionState(
    registerUserAction,
    INITIAL_STATE
  );
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (data: z.infer<typeof SignUpSchema>) => {
    setIsSubmitting(true);
    // This function calls the bound formAction with the form data
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Wrap the action call inside startTransition
    startTransition(() => {
      formAction(formData);
    });
  };

  const { setError } = form;

  useEffect(() => {
    setIsSubmitting(false);

    // Handle success case
    if (formState?.data && !formState.zodErrors && !formState.strapiErrors) {
      // Reset form fields on success
      form.reset();
      // Show success message
      setSuccessMessage("Account created successfully!");
    }

    if (formState?.zodErrors) {
      Object.entries(formState.zodErrors).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          setError(key as keyof z.infer<typeof SignUpSchema>, {
            type: "server",
            message: value[0],
          });
        }
      });
    }

    // Handle Strapi Errors (display them in a general error message)
    if (formState?.strapiErrors) {
      setError("root", {
        type: "server",
        message: formState.strapiErrors,
      });
    }
  }, [formState, setError]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

        <SubmitButton
          text="Create Account"
          loadingText="Loading"
          className="w-full my-6"
          loading={isSubmitting}
        />
        {successMessage && (
          <p className="text-green-500 text-sm pb-4">{successMessage}</p>
        )}

        {formState?.strapiErrors && (
          <p className="text-red-500 text-sm pb-4">
            {formState.strapiErrors.message}
          </p>
        )}
      </form>
    </Form>
  );
};

export default SignUpForm;
