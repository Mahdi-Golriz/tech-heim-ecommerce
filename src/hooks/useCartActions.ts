import { useCartStore } from "@/store/cart-store";
import useFetch from "./useFetch";
import { useUserStore } from "@/store/user-store";
import { User } from "@/models/user-model";

interface handleChangeItemQuantityParams {
  itemId: string;
  productId: string;
  itemQuantity: number;
  changeRate?: number;
  deleteItem?: boolean;
  color: string;
}

const useCartActions = () => {
  const { setCart, removeItem, updateQuantity } = useCartStore();
  const { setUser, user } = useUserStore();
  const { fetchData: updateItemQuantity, isLoading: actionLoading } = useFetch({
    autoFetch: false,
  });

  const { fetchData: fetchUserCart, isLoading: refreshCartLoading } = useFetch({
    path: "/api/users/me",
    autoFetch: false,
    skipRequestIfNoToken: true,
    params: {
      "populate[cart][populate][items][populate][product][populate]":
        "product_images",
    },
    onSuccess: (userData: User) => {
      setUser(userData);
      if (userData.cart) setCart(userData.cart);
    },
  });

  const handleChangeItemQuantity = async ({
    changeRate = 1,
    itemId,
    productId,
    itemQuantity,
    deleteItem = false,
    color,
  }: handleChangeItemQuantityParams) => {
    if (user?.cart) {
      await updateItemQuantity({
        method: deleteItem ? "DELETE" : "PUT",
        path: `/api/cart-items/${itemId}`,
        body: deleteItem
          ? null
          : { data: { quantity: itemQuantity + changeRate } },
      });

      await fetchUserCart();
    } else {
      if (deleteItem) {
        removeItem(productId, color);
      } else {
        updateQuantity(productId, color, changeRate);
      }
    }
  };

  return { handleChangeItemQuantity, refreshCartLoading, actionLoading };
};

export default useCartActions;
