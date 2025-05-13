"use client";

import usePaymentDetails from "@/hooks/usePaymentDetails";

const CartPaymentDetails = () => {
  const { subtotalPrice, grandTotal, discount } = usePaymentDetails();

  return (
    <>
      <h3 className="hidden md:block mb-6 text-2xl font-medium">
        Payment Details
      </h3>
      <ul className="flex flex-col gap-3">
        <li className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${subtotalPrice.toFixed(2)}</span>
        </li>
        <li className="flex justify-between border-b-2 pb-3 text-gray-600">
          <span>Discount</span>
          <span>${discount.toFixed(2)}</span>
        </li>
        <li className="flex justify-between font-medium">
          <span>Grand total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </li>
      </ul>
    </>
  );
};

export default CartPaymentDetails;
