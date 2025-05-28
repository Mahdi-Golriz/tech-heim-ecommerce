import useChangePersonalData from "@/hooks/useChangePersonalData";
import { useUserStore } from "@/store/user-store";
import { personalDataSchema } from "@/validations/personal-data-schema";
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
import { z } from "zod";
import Button from "../ui/button";

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

  const form = useForm<z.infer<typeof personalDataSchema>>({
    resolver: zodResolver(personalDataSchema),
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
      label: "Full name",
      placeholder: "First and Last Name",
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
      label: "Phone number",
      placeholder: "+1234567890",
      startIcon: PiDeviceMobileSpeakerDuotone,
    },
    {
      name: "address",
      label: "Address",
      placeholder: "country, city, street...",
      startIcon: PiBuildingFill,
    },
    {
      name: "postalCode",
      label: "Postal code",
      placeholder: "12345",
      startIcon: PiSignpostFill,
    },
  ];

  const onSubmit = async (formData: z.infer<typeof personalDataSchema>) => {
    if (!form.formState.isDirty) return;

    toast("Confirm Changes", {
      description: "Are you sure you want to update your account?",
      action: {
        label: "Save Changes",
        onClick: async () => {
          if (user?.documentId) {
            await handleChangePersonalData(formData, user.id);
            form.reset(form.getValues());
          }
        },
      },
      position: "top-center",
      cancel: {
        label: "Cancel",
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
          Save Changes
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
