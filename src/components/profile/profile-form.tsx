"use client";

import { useTransition } from "react";
import { useUserStore } from "@/store/user-store";
import { updateProfileAction } from "@/actions/profile.actions";
import useActionError from "@/hooks/useActionError";
import { Profile } from "@/models/user-model";

import { zodResolver } from "@hookform/resolvers/zod";
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
  PersonalDataFormValues,
  PersonalDataSchema,
} from "@/validations/get-personal-data-schema";

interface FormItem {
  name: "fullName" | "email" | "phoneNumber" | "address" | "postalCode";
  label: string;
  placeholder: string;
  startIcon: React.ComponentType<{ color?: string }>;
  disabled?: boolean;
}

interface ProfileFormProps {
  email: string;
  profile: Profile | null;
}

const ProfileForm = ({ email, profile }: ProfileFormProps) => {
  const setProfile = useUserStore((state) => state.setProfile);
  const actionError = useActionError();
  const [isSaving, startTransition] = useTransition();
  const formT = useTranslations("validation.profile");
  const t = useTranslations("profile.personalData");
  const form = useForm<PersonalDataFormValues, unknown, PersonalDataSchema>({
    resolver: zodResolver(getPersonalDataSchema(formT)),
    defaultValues: {
      fullName: profile?.fullName ?? profile?.username ?? "",
      address: profile?.address ?? "",
      email,
      phoneNumber: profile?.phoneNumber ?? "",
      postalCode: profile?.postalCode ?? "",
    },
  });

  const save = (formData: PersonalDataSchema) =>
    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (!result.ok) {
        toast.error(actionError(result.error));
        return;
      }
      setProfile(result.data);
      form.reset(form.getValues());
      toast.success(t("toast.success"));
    });

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
        onClick: () => save(formData),
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
          disabled={!form.formState.isDirty || isSaving}
        >
          {t("cta")}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
