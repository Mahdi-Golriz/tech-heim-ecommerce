"use client";

import { useCartStore } from "@/store/cart-store";
import Button from "../ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const CartPaymentDetails = () => {
  const t = useTranslations("cart");
  const { subtotalPrice, grandTotal, discount } = useCartStore();
  const items = useCartStore((state) => state.items);

  const isCartEmpty = items.length === 0;

  return (
    <div className="my-5 md:shadow-custom h-fit p-4 md:my-0 grow">
      <h3 className="hidden md:block mb-6 text-2xl font-medium">
        {t("paymentDetails.title")}
      </h3>
      <ul className="flex flex-col gap-3">
        <li className="flex justify-between text-gray-600">
          <span>{t("paymentDetails.subtotal")}</span>
          <span>${subtotalPrice.toFixed(2)}</span>
        </li>
        <li className="flex justify-between border-b-2 pb-3 text-gray-600">
          <span>{t("paymentDetails.discount")}</span>
          <span>${discount.toFixed(2)}</span>
        </li>
        <li className="flex justify-between font-medium">
          <span>{t("paymentDetails.grandTotal")}</span>
          <span>${grandTotal.toFixed(2)}</span>
        </li>
      </ul>
      <Button className="my-5 w-full" asChild disabled={items.length === 0}>
        <Link href={isCartEmpty ? "/products" : "/checkout"}>
          {isCartEmpty ? t("secondCta") : t("firstCta")}
        </Link>
      </Button>
    </div>
  );
};

export default CartPaymentDetails;
