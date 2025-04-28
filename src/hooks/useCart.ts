import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import useFetch from "./useFetch";
import { User } from "@/models/user-model";
import { Product } from "@/models/product-model";
import { CartItem } from "@/models/cart-model";
import { useCallback } from "react";

interface UseCartProps {
  product: Product;
  color: string;
  quantity: number;
}

const useCart = () => {
  const { items, addItem, setCart } = useCartStore();
  const { user, setUser } = useUserStore();

  //TODO
  // Fetch for user cart
  const { fetchData: fetchUserCart } = useFetch({
    path: "/api/users/me",
    autoFetch: !!user && !user.cart,
    skipRequestIfNoToken: true,
    onSuccess: (userData: User) => {
      setUser(userData);
      if (userData.cart) setCart(userData.cart);
    },
    params: { "populate[cart][populate][items][populate]": "product" },
  });

  // Generic fetch for cart operations
  const { fetchData, isLoading, error } = useFetch({
    autoFetch: false,
  });

  const addToCart = useCallback(
    async ({ color, product, quantity }: UseCartProps) => {
      if (!color || !product) return;

      // Create new item for local cart
      const newItem: CartItem = {
        id: 0,
        documentId: "",
        quantity,
        color,
        product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      };

      // Update local state immediately for responsive UI

      // If user is authenticated, sync with backend
      if (user?.cart) {
        // Find if item exists in cart
        const existingItem = items.find(
          (item) => item.product.id === product.id && item.color === color
        );

        try {
          if (existingItem) {
            // Update existing item
            await fetchData({
              method: "PUT",
              path: `/api/cart-items/${existingItem.documentId}`,
              body: { data: { quantity: existingItem.quantity + quantity } },
            });
          } else {
            // Add new item
            await fetchData({
              method: "POST",
              path: "/api/cart-items",
              body: {
                data: {
                  product: product.id,
                  cart: user.cart.id,
                  color,
                  quantity: 1,
                },
              },
            });
          }

          // Refresh user cart to ensure consistent data
          await fetchUserCart();
        } catch (err) {
          console.error("Failed to sync cart with backend:", err);
        }
      } else {
        addItem(newItem);
      }
    },
    [user, items, fetchData, addItem, fetchUserCart]
  );

  return {
    addToCart,
    isLoading,
    error,
  };
};

export default useCart;
