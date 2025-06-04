import { useCartStore } from "@/store/cart-store";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

interface CheckoutFormData {
  email: string;
  address: string;
  shippingCost: string;
}

interface CheckoutPaymentDetailsProps {
  form: UseFormReturn<CheckoutFormData>;
}

const CheckoutPaymentDetails = ({ form }: CheckoutPaymentDetailsProps) => {
  const { discount, grandTotal, subtotalPrice } = useCartStore();
  const shippingCost = parseFloat(form.watch("shippingCost") || "0");
  const t = useTranslations("checkout.checkoutCard.paymentDetails");
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
          <span>
            ${parseFloat(form.watch("shippingCost") || "0").toFixed(2)}
          </span>
        </li>
        <li className="flex justify-between font-medium">
          <span>{t("grandTotal")}</span>
          <span>$ {(grandTotal + shippingCost).toFixed(2)}</span>
        </li>
      </ul>
    </>
  );
};

export default CheckoutPaymentDetails;
