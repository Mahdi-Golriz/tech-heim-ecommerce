"use client";

import { useRouter } from "@/i18n/routing";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../ui/button";
import Image from "next/image";
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
// import Input from "../ui/input";
import { useUserStore } from "@/store/user-store";
import { useState } from "react";
import InputIcon from "../input-with-icon/icon-input";
import Input from "../ui/input";
import useSuccessPayment from "@/hooks/useSuccessPayment";
import { toast } from "sonner";

export const PaymentSchema = z.object({
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s/g, "")) // First, remove spaces
    .refine((val) => /^\d+$/.test(val), "Card number must contain only digits") // Then check for digits
    .refine((val) => val.length === 16, "Card number must be 16 digits"),
  nameOnCard: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
  expirationDate: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/(\d{2})$/,
      "Invalid expiration date format (MM/YY)"
    ),
  cvv: z
    .string()
    .regex(/^\d+$/, "CVV must contain only digits")
    .refine(
      (val) => val.length === 3 || val.length === 4,
      "CVV must be 3 or 4 digits"
    ),
  billingAddress: z.string().min(5, "Please enter a valid billing address"),
});

const PaymentForm = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const { items, clearCart } = useCartStore();
  const { checkoutDetails, clearCheckoutDetails } = useCheckoutStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { successfulPayment, orderData } = useSuccessPayment();

  const subtotalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const discount = items.reduce(
    (total, item) =>
      total +
      (item.product.price * item.product.discount_percentage! * item.quantity) /
        100,
    0
  );

  const shippingCost = checkoutDetails?.shippingCost || 0;
  const grandTotal = subtotalPrice - discount + shippingCost;

  const form = useForm<z.infer<typeof PaymentSchema>>({
    defaultValues: {
      cardNumber: "",
      nameOnCard: "",
      expirationDate: "",
      cvv: "",
      billingAddress: "",
    },
    resolver: zodResolver(PaymentSchema),
  });

  // Card number formatting (add spaces every 4 digits)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Expiration date formatting (MM/YY)
  const formatExpirationDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

    if (v.length >= 2) {
      const month = v.substring(0, 2);
      const year = v.substring(2, 4);

      // Validate month
      if (parseInt(month) > 12) {
        return v.substring(0, 1);
      }

      return month + (year ? "/" + year : "");
    }
    return v;
  };

  const handleReturnToCheckout = () => {
    router.push("/checkout");
  };

  const onSubmit = async (data: z.infer<typeof PaymentSchema>) => {
    setIsSubmitting(true);

    try {
      await successfulPayment({
        items,
        cardNumber: data.cardNumber,
        deliveryAddress: checkoutDetails?.address || "",
        totalPrice: grandTotal,
      });

      // Clear cart after successful payment
      clearCart();
      clearCheckoutDetails();
      const promise = () =>
        new Promise((resolve) => setTimeout(() => resolve(orderData), 1000));

      toast.promise(promise, {
        loading: "Loading...",
        success: () => {
          return "Your order has been placed successfully.";
        },
        error: "Error",
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Failed to process payment:", error);
      toast.error("Payment processing failed", {
        description: "Please check your payment details and try again.",
        duration: 1000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyShippingAddress = () => {
    if (checkoutDetails?.address) {
      form.setValue("billingAddress", checkoutDetails.address);
    }
  };

  //   If required data not available, show loading
  if (!user || !checkoutDetails || items.length === 0) {
    return (
      <div className="container my-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-2">Loading...</h2>
          <p className="text-gray-500">
            Please wait while we prepare your payment details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-6 flex flex-col md:flex-row md:gap-5">
      <div className="md:w-3/5">
        <div className="md:border md:rounded-lg md:px-8 md:py-6">
          <h2 className="text-xl font-medium mb-6">Payment Information</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel className="text-base font-medium text-gray-700">
                      Card Number
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
                      Name on Card
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
                        Expiration Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={formatExpirationDate(field.value)}
                          onChange={(e) =>
                            field.onChange(formatExpirationDate(e.target.value))
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
                      Billing address
                    </FormLabel>
                    <FormControl>
                      <InputIcon
                        {...field}
                        placeholder="123 Main St, City, Country"
                        endIcon={PiPencilSimpleLineDuotone}
                        color="blue"
                        variant="checkout"
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
                Use same as shipping address
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
            Return to Checkout
          </Button>
        </div>
      </div>

      <div className="md:grow md:px-8 md:py-6 md:border md:rounded-lg">
        <div className="my-4">
          <h3 className="text-base font-medium text-gray-700 mb-3">
            Your Order
          </h3>
          <ul className="hidden md:block">
            {items.map((item) => (
              <li key={item.createdAt} className="flex p-1 gap-1 border-b">
                {item.product.product_images && (
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_API_URL +
                      item.product.product_images[0].url
                    }
                    alt={item.product.title}
                    width={87}
                    height={74}
                    className="object-scale-down object-center"
                  />
                )}
                <div className="p-1 text-gray-600 grow">
                  <h3 className="line-clamp-1 text-xs">{item.product.title}</h3>
                  <p className="text-[10px] my-1">{item.color}</p>
                  <p className="text-[10px]">x{item.quantity}</p>
                  <p className="text-end">
                    {item.product.discount_percentage ? (
                      <>
                        <span className="text-[10px] line-through mr-3">
                          $ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-xs ">
                          ${" "}
                          {(
                            (item.product.price -
                              (item.product.discount_percentage / 100) *
                                item.product.price) *
                            item.quantity
                          ).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs">
                        $ {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <h3 className="md:hidden mb-6 text-2xl font-medium">Payment Details</h3>
        <ul className="flex flex-col gap-3 md:gap-2">
          <li className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>$ {subtotalPrice.toFixed(2)}</span>
          </li>
          <li className="flex justify-between text-gray-600">
            <span>Discount</span>
            <span>$ {discount.toFixed(2)}</span>
          </li>
          <li className="flex justify-between border-b-2 pb-3 text-gray-600">
            <span>Shipment cost</span>
            <span>${checkoutDetails?.shippingCost.toFixed(2)}</span>
          </li>
          <li className="flex justify-between font-medium">
            <span>Grand total</span>
            <span>$ {grandTotal.toFixed(2)}</span>
          </li>
        </ul>
        <Button
          className="w-full mt-5"
          onClick={form.handleSubmit(onSubmit)}
          type="submit"
        >
          {isSubmitting ? "Processing Payment..." : "Complete Payment"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentForm;
