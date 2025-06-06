"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { PiPencilSimpleLineDuotone } from "react-icons/pi";
import { useUserStore } from "@/store/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/cn";
import { Button, AuthWrapper, InputIcon } from "@/components";
import "swiper/css";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { useCheckoutStore } from "@/store/checkout-store";
import useAuthModalStore from "@/store/auth-modal-store";
import CheckoutSlider from "./checkout-slider";
import CheckoutPaymentDetails from "./checkout-payment-details";
import CheckoutItemsList from "./checkout-items-list";
import CheckoutHeader from "./checkout-header";
import AddressMapModal, { AddressData } from "../map/map-modal";
import { MdLocationOn } from "react-icons/md";
import { useTranslations } from "next-intl";
import {
  CheckoutSchema,
  getCheckoutSchema,
} from "@/validations/get-checkout-schema";

interface FormInputItems {
  name: "email" | "address" | "shippingCost";
  label: string;
  placeholder: string;
  disabled?: boolean;
}

interface FormRadioGroupItems {
  value: string;
  label: string;
  text: string;
}

const Checkout = () => {
  const router = useRouter();
  const formT = useTranslations("validation.checkout");
  const t = useTranslations("checkout");
  const user = useUserStore((state) => state.user);
  const { updateCheckoutDetails, checkoutDetails } = useCheckoutStore();
  const { toggleAuthModal, isAuthModalOpen } = useAuthModalStore();

  // State to track if we should redirect after successful login
  const [shouldRedirectToPayment, setShouldRedirectToPayment] = useState(false);
  // State for the map modal
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(getCheckoutSchema(formT)),
    defaultValues: {
      email: user?.email || "",
      address: checkoutDetails?.address || "",
      shippingCost: "0",
    },
  });

  // Update form values if user logs in during checkout
  useEffect(() => {
    if (user) {
      form.setValue("email", user.email || "");
    }
  }, [user, form]);

  // Listen for changes in user state (for when they log in via modal)
  useEffect(() => {
    if (user && shouldRedirectToPayment) {
      // If they logged in and we were waiting to redirect
      router.push("/payment");
      setShouldRedirectToPayment(false);
    }
  }, [user, shouldRedirectToPayment, router]);

  const onSubmit = (data: CheckoutSchema) => {
    updateCheckoutDetails({
      email: data.email,
      address: data.address,
      shippingCost: parseFloat(data.shippingCost),
    });
    if (!user) {
      // Set flag to redirect after successful login
      setShouldRedirectToPayment(true);

      toggleAuthModal();
    } else {
      router.push("/payment");
    }
  };

  const handleReturnToCart = () => {
    router.push("/cart");
  };

  // Function to handle address selection from the map
  const handleAddressSelected = (addressData: AddressData) => {
    form.setValue("address", addressData.fullAddress);
    // store coordinates in your checkout store
    updateCheckoutDetails({
      ...checkoutDetails,
      address: addressData.fullAddress,
    });
  };

  const formInputItems: FormInputItems[] = [
    {
      name: "email",
      label: "Email",
      placeholder: "Email...",
      disabled: !!user,
    },
    {
      name: "address",
      label: t("formInputs.shipTo.label"),
      placeholder: t("formInputs.shipTo.placeholder"),
    },
  ];

  const formRadioGroupItems: FormRadioGroupItems[] = [
    {
      value: "0",
      label: t("formInputs.shippingMethod.free.label"),
      text: t("formInputs.shippingMethod.free.text"),
    },
    {
      value: "7.5",
      label: t("formInputs.shippingMethod.regular.label"),
      text: t("formInputs.shippingMethod.regular.text"),
    },
    {
      value: "22.5",
      label: t("formInputs.shippingMethod.express.label"),
      text: t("formInputs.shippingMethod.express.text"),
    },
  ];

  return (
    <>
      <CheckoutHeader />
      <div className="my-6 flex flex-col md:flex-row md:gap-5">
        <div className="md:w-3/5">
          <div className="md:border md:rounded-lg md:px-8 md:py-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {formInputItems.map((item) => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name}
                    disabled={item.disabled}
                    render={({ field }) => (
                      <FormItem className="mt-3">
                        <FormLabel className="text-base font-medium text-gray-700">
                          {item.label}
                        </FormLabel>
                        <FormControl>
                          <InputIcon
                            {...field}
                            placeholder={item.placeholder}
                            endIcon={PiPencilSimpleLineDuotone}
                            color="blue"
                            variant="checkout"
                            className="pr-10"
                          />
                        </FormControl>
                        {item.name === "address" && (
                          <div className="mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex items-center text-sm"
                              onClick={() => setIsMapModalOpen(true)}
                            >
                              <MdLocationOn className="mr-1" />
                              {t("formInputs.shipTo.cta")}
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name="shippingCost"
                  render={({ field }) => (
                    <FormItem className="mt-3">
                      <FormLabel className="text-base font-medium text-gray-700">
                        {t("formInputs.shippingMethod.label")}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {formRadioGroupItems.map((item) => (
                            <FormItem
                              key={item.value}
                              className={cn(
                                "flex items-start space-x-3 space-y-0 p-2 rounded-lg transition-colors duration-200 text-gray-500",
                                field.value === item.value
                                  ? "bg-blue-50 border border-blue-500"
                                  : "bg-gray-50 border border-transparent"
                              )}
                            >
                              <FormControl>
                                <RadioGroupItem value={item.value} />
                              </FormControl>
                              <div className="w-full">
                                <FormLabel className="font-normal">
                                  <p className="text-sm mb-1 text-gray-600">
                                    {item.label}
                                  </p>
                                </FormLabel>
                                <div className="flex justify-between text-xs">
                                  <span>{item.text}</span>
                                  <span>${item.value}</span>
                                </div>
                              </div>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <div>
            <Button
              variant="custom"
              className="text-primary my-2 px-0 ml-2"
              onClick={handleReturnToCart}
            >
              {t("returnButton")}
            </Button>
          </div>
        </div>

        <div className="md:grow md:px-8 md:py-6 md:border md:rounded-lg">
          <div className="my-4">
            <h3 className="text-base font-medium text-gray-700 mb-3">
              {t("checkoutCard.title")}
            </h3>
            <CheckoutSlider />
            <CheckoutItemsList />
          </div>
          <CheckoutPaymentDetails form={form} />
          <Button
            className="w-full mt-5"
            onClick={form.handleSubmit(onSubmit)}
            type="submit"
          >
            {t("checkoutCard.cta")}
          </Button>
        </div>
        {isAuthModalOpen && <AuthWrapper />}
        {/* Map Modal */}
        <AddressMapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          onAddressSelected={handleAddressSelected}
        />
      </div>
    </>
  );
};

export default Checkout;
