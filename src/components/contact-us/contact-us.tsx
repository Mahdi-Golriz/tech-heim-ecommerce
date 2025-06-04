"use client";

import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Input from "../ui/input";
import { Textarea } from "../ui/textarea";
import Button from "../ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import CustomBreadcrumb from "../custom-breadcrumb/custom-breadcrumb";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ContactUs = () => {
  const t = useTranslations("contactUs");
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = () => {
    form.reset();
    toast.success(t("form.toast"));
  };

  const items = [
    { Icon: MapPin, title: t("icons.office"), text: "Hamburg, Germany" },
    { Icon: Mail, title: t("icons.email"), text: "info@techhelm.com" },
    { Icon: Phone, title: t("icons.phone"), text: "+49 123-4567" },
  ];

  const links = [
    { href: "/", title: "Home" },
    {
      href: "",
      title: t("breadcrumb"),
    },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />
      <div className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {items.map((item) => (
            <div className="text-center" key={item.title}>
              <div className="inline-flex items-center justify-center size-12 bg-primary-25 rounded-full mb-4">
                <item.Icon className="size-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("messageUs.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("messageUs.description")}
            </p>
          </div>

          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.name")}
                          {...field}
                          className="w-full"
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
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("form.placeholders.email")}
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={t("form.placeholders.message")}
                          rows={6}
                          {...field}
                          className="w-full resize-vertical"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit">{t("form.cta")}</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
