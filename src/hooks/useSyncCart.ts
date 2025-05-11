import useFetch from "./useFetch";
import { useUserStore } from "@/store/user-store";
import { useCartStore } from "@/store/cart-store";
import { User } from "@/models/user-model";
import { SigninResponse } from "@/models/response-model";
import { useAuthModalStore } from "@/store/auth-modal-store";

interface useSyncCartProps {
  setOpenModal: (openModal: boolean) => void;
}

const useSyncCart = ({ setOpenModal }: useSyncCartProps) => {
  const setUser = useUserStore((state) => state.setUser);
  const setCart = useCartStore((state) => state.setCart);
  const { items: localCartItems } = useCartStore();
  const { toggleAuthModal } = useAuthModalStore();

  // Create cart after sign up
  // It should be done by backend! but here, backend is Strapi
  const { fetchData: createCart } = useFetch({
    method: "POST",
    path: "/api/carts",
    autoFetch: false,
  });

  // Generic fetch for cart operations
  const { fetchData: addItemToCart } = useFetch({
    method: "POST",
    path: "/api/cart-items",
    autoFetch: false,
  });

  const { fetchData: updateCartItem } = useFetch({
    method: "PUT",
    autoFetch: false,
  });

  // Update the user store and cart store with updated user in backend
  const { fetchData: refreshUserCart } = useFetch<SigninResponse>({
    path: "/api/users/me",
    autoFetch: false,
    params: {
      "populate[cart][populate][items][populate][product][populate]":
        "product_images",
    },
    onSuccess: (updatedUserData: User) => {
      setCart(updatedUserData.cart);
      setTimeout(() => {
        setUser(updatedUserData);
        setOpenModal(false);
        toggleAuthModal();
      }, 1000);
    },
  });

  const { fetchData: fetchUserWithMergedCart } = useFetch({
    path: "/api/users/me",
    autoFetch: false,
    params: {
      "populate[cart][populate][items][populate][product][populate]":
        "product_images",
    },
    onSuccess: async (userData: User) => {
      // If user has local cart items and a backend cart, merge them
      if (localCartItems.length > 0 && userData.cart) {
        await mergeCartsAfterLogin(userData);

        // Fetch updated user data after merging carts and update the store
        await refreshUserCart();
      } else {
        // No merging needed

        setCart(userData.cart);
        setTimeout(() => {
          setUser(userData);
          setOpenModal(false);
          toggleAuthModal();
        }, 1000);
      }
    },
  });

  // Function to merge local cart with backend cart
  const mergeCartsAfterLogin = async (userData: User) => {
    if (!localCartItems.length || !userData.cart) return;

    try {
      // Process each local cart item
      for (const item of localCartItems) {
        // Check if item already exists in backend cart
        const existingItem = userData.cart.items.find(
          (cartItem) =>
            cartItem.product.documentId === item.product.documentId &&
            cartItem.color === item.color
        );

        if (existingItem) {
          // Update existing item quantity
          await updateCartItem({
            path: `/api/cart-items/${existingItem.documentId}`,
            body: {
              data: {
                quantity: existingItem.quantity + item.quantity,
              },
            },
          });
        } else {
          // Add new item to backend cart
          await addItemToCart({
            body: {
              data: {
                product: item.product.id,
                cart: userData.cart.id,
                color: item.color,
                quantity: item.quantity,
              },
            },
          });
        }
      }
    } catch (error) {
      console.error("Error merging carts:", error);
    }
  };

  return { fetchUserWithMergedCart, createCart };
};

export default useSyncCart;
