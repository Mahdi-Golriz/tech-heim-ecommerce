"use client";

import { z } from "zod";
import { TiTick } from "react-icons/ti";

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
import { SubmitButton } from "./submit-button";
import useSignup, { SignUpSchema } from "@/hooks/useSignup";

interface SignUpFormProps {
  onClose: VoidFunction;
}

const SignUpForm = ({ onClose }: SignUpFormProps) => {
  const { signup, isSubmitting, error, form, openModal, setOpenModal } =
    useSignup({
      onClose,
    });

  const onSubmit = (data: z.infer<typeof SignUpSchema>) => {
    signup(data);
  };

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
          {error ? (
            <p className="text-red-500 text-sm pb-4">{error.message}</p>
          ) : (
            <p className="h-9 pb-4"></p>
          )}
        </form>
      </Form>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="w-[442px]">
          <div className="size-28 shadow-custom rounded-full bg-white mx-auto flex items-center justify-center">
            <TiTick color="darkGreen" size={50} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center  text-2xl font-medium text-success">
              Well done
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-500">
            Congratulation your account has been successfully created.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignUpForm;
