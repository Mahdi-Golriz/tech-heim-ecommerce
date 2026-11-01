"use client";

import {
  selectDiscount,
  selectGrandTotal,
  selectSubtotal,
  useCartStore,
} from "@/store/cart-store";
import { useTranslations } from "next-intl";

interface OrderSummaryProps {
  shippingCost: number;
  /** Translation namespace holding title/subtotal/discount/shipmentCost/grandTotal */
  namespace:
    | "checkout.checkoutCard.paymentDetails"
    | "payment.paymentCard.paymentDetails";
}

/** Totals shown on checkout and payment. Display only: the server recomputes them. */
const OrderSummary = ({ shippingCost, namespace }: OrderSummaryProps) => {
  const t = useTranslations(namespace);
  const subtotalPrice = useCartStore(selectSubtotal);
  const discount = useCartStore(selectDiscount);
  const grandTotal = useCartStore(selectGrandTotal);

  return (
    <>
      <h3 className="md:hidden mb-6 text-2xl font-medium">{t("title")}</h3>
      <ul className="flex flex-col gap-3 md:gap-2">
        <li className="flex justify-between text-gray-600">
          <span>{t("subtotal")}</span>
          <span>$ {subtotalPrice.toFixed(2)}</span>
        </li>
        <li className="flex justify-between text-gray-600">
          <span>{t("discount")}</span>
          <span>$ {discount.toFixed(2)}</span>
        </li>
        <li className="flex justify-between border-b-2 pb-3 text-gray-600">
          <span>{t("shipmentCost")}</span>
          <span>$ {shippingCost.toFixed(2)}</span>
        </li>
        <li className="flex justify-between font-medium">
          <span>{t("grandTotal")}</span>
          <span>$ {(grandTotal + shippingCost).toFixed(2)}</span>
        </li>
      </ul>
    </>
  );
};

export default OrderSummary;
