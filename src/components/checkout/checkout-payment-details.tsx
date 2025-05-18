import { useCartStore } from "@/store/cart-store";
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

  return (
    <>
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
          <span>$ {(grandTotal + shippingCost).toFixed(2)}</span>
        </li>
      </ul>
    </>
  );
};

export default CheckoutPaymentDetails;
