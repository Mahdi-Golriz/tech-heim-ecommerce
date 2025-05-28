import useFetch from "./useFetch";
import { CartItem } from "@/models/cart-model";

export interface OrderData {
  cardNumber: string;
  totalPrice: number;
  deliveryAddress: string;
  items: CartItem[];
  userId: string;
}

const useSuccessPayment = () => {
  const {
    fetchData: createOrder,
    data: orderData,
    isLoading: createOrderLoading,
  } = useFetch({
    autoFetch: false,
  });

  const { fetchData: deleteCartItems, isLoading: deleteItemsLoading } =
    useFetch({
      autoFetch: false,
    });

  const successfulPayment = async ({
    items,
    cardNumber,
    deliveryAddress,
    totalPrice,
    userId,
  }: OrderData) => {
    const itemsDetails = items.map((item) => ({
      itemNum: item.quantity,
      itemTitle: item.product.title,
      itemColor: item.color,
      itemPrice: item.product.discount_percentage
        ? (1 - item.product.discount_percentage / 100) * item.product.price
        : item.product.price,
    }));

    try {
      await createOrder({
        method: "POST",
        path: "/api/orders",
        body: {
          data: {
            cardNumber: cardNumber,
            totalPrice: totalPrice,
            deliveryAddress: deliveryAddress,
            user: userId,
            itemsDetails: itemsDetails,
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

  return {
    successfulPayment,
    orderData,
    deleteItemsLoading,
    createOrderLoading,
  };
};

export default useSuccessPayment;
