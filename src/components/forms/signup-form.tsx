"use client";

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
import SubmitButton from "./submit-button";
import useSignup from "@/hooks/useSignup";
import { useTranslations } from "next-intl";
import { SignUpSchema } from "@/validations/get-auth-schema";

const SignUpForm = () => {
  const t = useTranslations("authentication.signUp");
  const { signup, isSubmitting, error, form } = useSignup();

  const onSubmit = (data: SignUpSchema) => {
    signup(data);
  };

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
          text={t("title")}
          loadingText="Loading"
          className="w-full my-6"
          loading={isSubmitting}
        />
        {error ? (
          <p className="text-red-500 text-sm pb-4">{error.message}</p>
        ) : (
          <p className="h-9 pb-4"></p>
        )}
      </form>
    </Form>
  );
};

export default SignUpForm;
