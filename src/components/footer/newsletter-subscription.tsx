"use client";

import { PiCaretRight, PiUserLight } from "react-icons/pi";
import Button from "../ui/button";
import { useTranslations } from "next-intl";
import InputIcon from "../input-with-icon/icon-input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

const NewsletterSubscription = () => {
  const t = useTranslations("footer.emailInput");

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (formData: z.infer<typeof emailSchema>) => {
    if (!formData.email) return;
    console.log(formData);
    form.reset();
    toast.success(t("toast"));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("label")}</FormLabel>
              <FormControl>
                <div className="w-full flex justify-between rounded-lg border-2 mt-3 px-3">
                  <InputIcon
                    parentClassName="w-full"
                    placeholder={t("placeholder")}
                    {...field}
                    autoComplete="off"
                    startIcon={PiUserLight}
                    color="white"
                    className="w-full bg-transparent border-none pl-9 focus-visible:ring-0 focus-visible:ring-offset-0 lg:w-64 text-white"
                  />
                  <Button
                    variant="icon"
                    className="[&_svg]:size-3 px-2"
                    type="submit"
                  >
                    <PiCaretRight color="white" strokeWidth={10} />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
export default NewsletterSubscription;
