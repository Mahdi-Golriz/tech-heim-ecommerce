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
import { PiUserLight } from "react-icons/pi";
import { SubmitButton } from "./submit-button";
import useSignin from "@/hooks/useSignin";
import { useTranslations } from "next-intl";
import { SignInSchema } from "@/validations/get-auth-schema";

const SignInForm = () => {
  const t = useTranslations("authentication.signIn");
  const { signin, isLoading, error, form } = useSignin();

  const onSubmit = (data: SignInSchema) => {
    signin(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormControl>
                <InputIcon
                  {...field}
                  placeholder="Email"
                  startIcon={PiUserLight}
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
          loading={isLoading}
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

export default SignInForm;
