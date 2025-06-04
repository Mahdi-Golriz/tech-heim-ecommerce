import useChangePersonalData from "@/hooks/useChangePersonalData";
import { useUserStore } from "@/store/user-store";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import InputIcon from "../input-with-icon/icon-input";
import {
  PiUserFill,
  PiLassoDuotone,
  PiDeviceMobileSpeakerDuotone,
  PiBuildingFill,
  PiSignpostFill,
} from "react-icons/pi";
import Button from "../ui/button";
import { useTranslations } from "next-intl";
import {
  getPersonalDataSchema,
  PersonalDataSchema,
} from "@/validations/get-personal-data-schema";

interface FormItem {
  name: "fullName" | "email" | "phoneNumber" | "address" | "postalCode";
  label: string;
  placeholder: string;
  startIcon: React.ComponentType<{ color?: string }>;
  disabled?: boolean;
}

const ProfileForm = () => {
  const user = useUserStore((state) => state.user);
  const { handleChangePersonalData } = useChangePersonalData();
  const formT = useTranslations("validation.profile");
  const t = useTranslations("profile.personalData");
  const form = useForm<PersonalDataSchema>({
    resolver: zodResolver(getPersonalDataSchema(formT)),
    defaultValues: {
      fullName: "",
      address: "",
      email: "",
      phoneNumber: "",
      postalCode: "",
    },
  });

  // Reset form when user data becomes available
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName ?? user.username ?? "",
        address: user.address ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        postalCode: user.postalCode ?? "",
      });
    }
  }, [user, form]);

  const formItems: FormItem[] = [
    {
      name: "fullName",
      label: t("formInputs.fullName.label"),
      placeholder: t("formInputs.fullName.placeholder"),
      startIcon: PiUserFill,
    },
    {
      name: "email",
      label: "Email",
      placeholder: "techheim@gmail.com",
      startIcon: PiLassoDuotone,
      disabled: true,
    },
    {
      name: "phoneNumber",
      label: t("formInputs.phoneNumber.label"),
      placeholder: "+1234567890",
      startIcon: PiDeviceMobileSpeakerDuotone,
    },
    {
      name: "address",
      label: t("formInputs.address.label"),
      placeholder: t("formInputs.address.placeholder"),
      startIcon: PiBuildingFill,
    },
    {
      name: "postalCode",
      label: t("formInputs.postalCode.label"),
      placeholder: "12345",
      startIcon: PiSignpostFill,
    },
  ];

  const onSubmit = async (formData: PersonalDataSchema) => {
    if (!form.formState.isDirty) return;

    toast(t("toast.confirmLabel"), {
      description: t("toast.confirmDescription"),
      action: {
        label: t("toast.saveAction"),
        onClick: async () => {
          if (user?.documentId) {
            await handleChangePersonalData(formData, user.id);
            form.reset(form.getValues());
          }
        },
      },
      position: "top-center",
      cancel: {
        label: t("toast.cancelAction"),
        onClick: () => {
          toast.dismiss();
        },
      },
      duration: Infinity,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid sm:grid-cols-2 gap-3"
      >
        {formItems.map((item) => (
          <FormField
            key={item.name}
            control={form.control}
            name={item.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{item.label}</FormLabel>
                <FormControl>
                  <InputIcon
                    placeholder={item.placeholder}
                    {...field}
                    startIcon={item.startIcon}
                    disabled={item.disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          type="submit"
          variant="default"
          className="mt-5 sm:col-span-full sm:w-fit"
          disabled={!form.formState.isDirty}
        >
          {t("cta")}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
