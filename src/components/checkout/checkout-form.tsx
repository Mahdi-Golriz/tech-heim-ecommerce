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
import InputIcon from "../input-with-icon/icon-input";
import { PiPencilSimpleLineDuotone } from "react-icons/pi";
import { z } from "zod";
import { useUserStore } from "@/store/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";
import Button from "../ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCartStore } from "@/store/cart-store";
import CheckoutCart from "./checkout-cart";
import "swiper/css";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { useCheckoutStore } from "@/store/checkout-store";
import { useAuthModalStore } from "@/store/auth-modal-store";
import AuthWrapper from "../auth/auth-wrapper";

const CheckoutSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  address: z.string().min(1, { message: "Address is required" }),
  shippingCost: z.string(),
});

const CheckoutForm = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const { items } = useCartStore();
  const { updateCheckoutDetails } = useCheckoutStore();
  const { toggleAuthModal, isAuthModalOpen } = useAuthModalStore();

  // State to track if we should redirect after successful login
  const [shouldRedirectToPayment, setShouldRedirectToPayment] = useState(false);

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

  const form = useForm<z.infer<typeof CheckoutSchema>>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      email: user?.email || "",
      address: user?.address || "",
      shippingCost: "0",
    },
  });

  // Update form values if user logs in during checkout
  useEffect(() => {
    if (user) {
      form.setValue("email", user.email || "");
      // If user has a saved address, use it
      if (user.address) {
        form.setValue("address", user.address);
      }
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

  const onSubmit = (data: z.infer<typeof CheckoutSchema>) => {
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

  // Calculate the grand total including shipping
  const shippingCost = parseFloat(form.watch("shippingCost") || "0");
  const grandTotal = subtotalPrice - discount + shippingCost;

  return (
    <div className="container my-6 flex flex-col md:flex-row md:gap-5">
      <div className="md:w-3/5">
        <div className="md:border md:rounded-lg md:px-8 md:py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium text-gray-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <InputIcon
                        {...field}
                        placeholder="Email..."
                        endIcon={PiPencilSimpleLineDuotone}
                        color="blue"
                        variant="checkout"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel className="text-base font-medium text-gray-700">
                      Ship to
                    </FormLabel>
                    <FormControl>
                      <InputIcon
                        {...field}
                        placeholder="address..."
                        endIcon={PiPencilSimpleLineDuotone}
                        color="blue"
                        variant="checkout"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingCost"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel className="text-base font-medium text-gray-700">
                      Shipping Method
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem
                          className={cn(
                            "flex items-start space-x-3 space-y-0 p-2 rounded-lg transition-colors duration-200 text-gray-500",
                            field.value === "0"
                              ? "bg-blue-50 border border-blue-500"
                              : "bg-gray-50 border border-transparent"
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem value="0" />
                          </FormControl>
                          <div className="w-full">
                            <FormLabel className="font-normal">
                              <p className="text-sm mb-1 text-gray-600">
                                Free Shipping
                              </p>
                            </FormLabel>
                            <div className="flex justify-between text-xs">
                              <span>7-30 business days</span>
                              <span>$0</span>
                            </div>
                          </div>
                        </FormItem>
                        <FormItem
                          className={cn(
                            "flex items-start space-x-3 space-y-0 p-2 rounded-lg transition-colors duration-200 text-gray-500",
                            field.value === "7.5"
                              ? "bg-blue-50 border border-blue-500"
                              : "bg-gray-50 border border-transparent"
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem value="7.5" />
                          </FormControl>
                          <div className="w-full">
                            <FormLabel className="font-normal">
                              <p className="text-sm mb-1 text-gray-600">
                                Regular Shipping
                              </p>
                            </FormLabel>
                            <div className="flex justify-between text-xs">
                              <span>3-14 business days</span>
                              <span>$7.5</span>
                            </div>
                          </div>
                        </FormItem>
                        <FormItem
                          className={cn(
                            "flex items-start space-x-3 space-y-0 p-2 rounded-lg transition-colors duration-200 text-gray-500",
                            field.value === "22.5"
                              ? "bg-blue-50 border border-blue-500"
                              : "bg-gray-50 border border-transparent"
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem value="22.5" />
                          </FormControl>
                          <div className="w-full">
                            <FormLabel className="font-normal">
                              <p className="text-sm mb-1 text-gray-600">
                                Express Shipping
                              </p>
                            </FormLabel>
                            <div className="flex justify-between text-xs">
                              <span>1-3 business days</span>
                              <span>$22.5</span>
                            </div>
                          </div>
                        </FormItem>
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
            Return to Cart
          </Button>
        </div>
      </div>

      <div className="md:grow md:px-8 md:py-6 md:border md:rounded-lg">
        <div className="my-4">
          <h3 className="text-base font-medium text-gray-700 mb-3">
            Your Order
          </h3>
          <div className="md:hidden">
            <Swiper
              grabCursor
              breakpoints={{
                320: { slidesPerView: 3.5, spaceBetween: 0 },
                640: { slidesPerView: 4, spaceBetween: 0 },
                768: { slidesPerView: 5, spaceBetween: 0 },
              }}
              className="bg-gray-100 rounded-lg "
            >
              {items.map((item) => (
                <SwiperSlide key={item.createdAt} className="py-3 pl-3">
                  <CheckoutCart
                    color={item.color}
                    quantity={item.quantity}
                    src={
                      item.product.product_images
                        ? item.product.product_images[0].url
                        : ""
                    }
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
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
            <span>
              ${parseFloat(form.watch("shippingCost") || "0").toFixed(2)}
            </span>
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
          Continue to pay
        </Button>
      </div>
      {isAuthModalOpen && <AuthWrapper />}
    </div>
  );
};

export default CheckoutForm;
