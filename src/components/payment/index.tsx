"use client";

import { useRouter } from "@/i18n/routing";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Input, InputIcon } from "@/components";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  PiArrowsCounterClockwiseDuotone,
  PiPencilSimpleLineDuotone,
} from "react-icons/pi";
import { useUserStore } from "@/store/user-store";
import { useEffect, useRef } from "react";
import useSuccessPayment from "@/hooks/useSuccessPayment";
import { toast } from "sonner";
import {
  getPaymentSchema,
  PaymentSchema,
} from "@/validations/get-payment-schema";
import PaymentDetails from "./payment-details";
import { formatCardNumber, formatExpirationDate } from "@/utils/formatter";
import CheckoutItemsList from "../checkout/checkout-items-list";
import PaymentHeader from "./payment-header";
import { useTranslations } from "next-intl";

const PaymentForm = () => {
  const formT = useTranslations("validation.payment");
  const t = useTranslations("payment");
  const router = useRouter();
  const { user } = useUserStore();
  const { items, clearCart, discount, subtotalPrice } = useCartStore();
  const { checkoutDetails, clearCheckoutDetails } = useCheckoutStore();
  const skipRedirect = useRef(false);

  const { successfulPayment, createOrderLoading, deleteItemsLoading } =
    useSuccessPayment();

  useEffect(() => {
    if (!checkoutDetails && !skipRedirect.current) {
      router.push("/checkout");
    }
  }, [checkoutDetails, router]);

  const shippingCost = checkoutDetails?.shippingCost || 0;
  const grandTotal = subtotalPrice - discount + shippingCost;

  const form = useForm<PaymentSchema>({
    defaultValues: {
      cardNumber: "",
      nameOnCard: "",
      expirationDate: "",
      cvv: "",
      billingAddress: "",
    },
    resolver: zodResolver(getPaymentSchema(formT)),
  });

  const handleReturnToCheckout = () => {
    router.push("/checkout");
  };

  const onSubmit = async (data: PaymentSchema) => {
    const toastId = toast.loading(t("toast.processingPayment"));
    try {
      if (user)
        await successfulPayment({
          items,
          cardNumber: data.cardNumber,
          deliveryAddress: checkoutDetails?.address || "",
          totalPrice: grandTotal,
          userId: user?.documentId,
        });

      toast.success(t("toast.successfulPayment"), {
        id: toastId,
      });
      router.push("/");

      // Clear cart after successful payment
      skipRedirect.current = true;
      clearCart();
      clearCheckoutDetails();
    } catch (error) {
      console.error("Failed to process payment:", error);
      toast.error(t("toast.unsuccessfulPayment.title"), {
        description: t("toast.unsuccessfulPayment.description"),
        duration: 1000,
      });
    }
  };

  const copyShippingAddress = () => {
    if (checkoutDetails?.address) {
      form.setValue("billingAddress", checkoutDetails.address);
    }
  };

  if (!user || items.length === 0) {
    //   If required data not available, show loading
    return (
      <div className="my-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-2">{t("loading.title")}</h2>
          <p className="text-gray-500">{t("loading.text")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PaymentHeader />
      <div className="my-6 flex flex-col md:flex-row md:gap-5">
        <div className="md:w-3/5">
          <div className="md:border md:rounded-lg md:px-8 md:py-6">
            <h2 className="text-xl font-medium mb-6">
              {t("formInputs.title")}
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem className="mt-3">
                      <FormLabel className="text-base font-medium text-gray-700">
                        {t("formInputs.cardNumberLabel")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          value={formatCardNumber(field.value)}
                          onChange={(e) =>
                            field.onChange(formatCardNumber(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nameOnCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-gray-700">
                        {t("formInputs.cardNameLabel")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="text" placeholder="John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-gray-700">
                          {t("formInputs.expirationDate")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={formatExpirationDate(field.value)}
                            onChange={(e) =>
                              field.onChange(
                                formatExpirationDate(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-gray-700">
                          CVV
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="123"
                            maxLength={4}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="billingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-gray-700">
                        {t("formInputs.billingAddress")}
                      </FormLabel>
                      <FormControl>
                        <InputIcon
                          {...field}
                          placeholder="123 Main St, City, Country"
                          endIcon={PiPencilSimpleLineDuotone}
                          color="blue"
                          variant="checkout"
                          className="pr-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyShippingAddress}
                  className="flex items-center gap-2 text-primary border-primary hover:bg-primary/10"
                >
                  <PiArrowsCounterClockwiseDuotone className="w-4 h-4" />
                  {t("formInputs.useAddress")}
                </Button>
              </form>
            </Form>
          </div>

          <div>
            <Button
              variant="custom"
              className="text-primary my-2 px-0 ml-2"
              onClick={handleReturnToCheckout}
            >
              {t("returnButton")}
            </Button>
          </div>
        </div>

        <div className="md:grow md:px-8 md:py-6 md:border md:rounded-lg">
          <div className="my-4">
            <h3 className="text-base font-medium text-gray-700 mb-3">
              {t("paymentCard.title")}
            </h3>
            <CheckoutItemsList />
          </div>
          <PaymentDetails />
          <Button
            className="w-full mt-5"
            onClick={form.handleSubmit(onSubmit)}
            type="submit"
          >
            {createOrderLoading || deleteItemsLoading
              ? t("paymentCard.paymentProcessing")
              : t("paymentCard.cta")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default PaymentForm;
