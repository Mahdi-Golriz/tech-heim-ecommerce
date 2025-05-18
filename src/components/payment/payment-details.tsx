import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";

const PaymentDetails = () => {
  const { discount, grandTotal, subtotalPrice } = useCartStore();
  const { checkoutDetails } = useCheckoutStore();
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
          <span>${checkoutDetails?.shippingCost?.toFixed(2)}</span>
        </li>
        <li className="flex justify-between font-medium">
          <span>Grand total</span>
          <span>$ {grandTotal.toFixed(2)}</span>
        </li>
      </ul>
    </>
  );
};

export default PaymentDetails;
