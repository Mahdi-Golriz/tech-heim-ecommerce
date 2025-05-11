import useFetch from "./useFetch";
import { CartItem } from "@/models/cart-model";

export interface OrderData {
  cardNumber: string;
  totalPrice: number;
  deliveryAddress: string;
  items: CartItem[];
}

const useSuccessPayment = () => {
  const { fetchData: createOrder, data: orderData } = useFetch({
    autoFetch: false,
  });

  const { fetchData: deleteCartItems } = useFetch({
    autoFetch: false,
  });

  const successfulPayment = async ({
    items,
    cardNumber,
    deliveryAddress,
    totalPrice,
  }: OrderData) => {
    try {
      await createOrder({
        method: "POST",
        path: "/api/orders",
        body: {
          data: {
            cardNumber: cardNumber,
            totalPrice: totalPrice,
            deliveryAddress: deliveryAddress,
          },
        },
      });

      for (const item of items) {
        await deleteCartItems({
          method: "DELETE",
          path: `/api/cart-items/${item.documentId}`,
        });
      }
    } catch (err) {
      console.error("Failed to handle successful payment:", err);
    }
  };

  return { successfulPayment, orderData };
};

export default useSuccessPayment;
