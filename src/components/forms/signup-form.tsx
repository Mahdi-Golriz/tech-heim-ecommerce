"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
// import { registerUserAction } from "@/app/data/actions/auth-actions";
// import { startTransition, useActionState, useEffect, useState } from "react";
import { SubmitButton } from "./submit-button";
import useSignup from "@/hooks/useSignup";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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

interface SignUpFormProps {
  onClose: VoidFunction;
}

const SignUpForm = ({ onClose }: SignUpFormProps) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { signup, isSubmitting, data, error, strapiError } = useSignup();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof SignUpSchema>) => {
    signup(data);
  };

  // const { setError } = form;

  useEffect(() => {
    if (data?.user && !strapiError && !error) {
      form.reset();
      setSuccessMessage(
        "Congratulation your account has been successfully created."
      );
      setOpenModal(true);
      setTimeout(() => {
        setOpenModal(false);
        onClose();
        setSuccessMessage("");
      }, 1000);
    }

    if (error) {
      setErrorMessage(error.message);
      setOpenModal(true);
      setTimeout(() => {
        setOpenModal(false);
        setErrorMessage("");
      }, 1500);
    }
  }, [data, strapiError, error, form]);

  return (
    <>
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
          {strapiError && (
            <p className="text-red-500 text-sm pb-4">{strapiError}</p>
          )}
        </form>
      </Form>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="w-[442px]">
          <div className="size-28 shadow-custom rounded-full bg-white mx-auto flex items-center justify-center">
            {successMessage ? (
              <TiTick color="darkGreen" size={50} />
            ) : (
              <IoClose color="red" size={50} />
            )}
          </div>
          <DialogHeader>
            <DialogTitle
              className={cn(
                "text-center  text-2xl font-medium",
                successMessage ? "text-success" : "text-error"
              )}
            >
              {successMessage ? "Well done" : "Oops."}
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-500">
            {successMessage
              ? "Congratulation your account has been successfully created."
              : errorMessage}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignUpForm;
