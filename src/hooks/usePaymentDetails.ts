import { useCartStore } from "@/store/cart-store";
import { useMemo } from "react";

const usePaymentDetails = () => {
  const items = useCartStore((state) => state.items);

  const { subtotalPrice, discount, grandTotal } = useMemo(() => {
    const subtotal = items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    const discountAmount = items.reduce(
      (total, item) =>
        total +
        ((item.product.price * (item.product.discount_percentage || 0)) / 100) *
          item.quantity,
      0
    );

    return {
      subtotalPrice: subtotal,
      discount: discountAmount,
      grandTotal: subtotal - discountAmount,
    };
  }, [items]);

  return {
    subtotalPrice,
    discount,
    grandTotal,
  };
};

export default usePaymentDetails;
