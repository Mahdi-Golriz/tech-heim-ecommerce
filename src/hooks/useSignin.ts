/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import useFetch from "./useFetch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserStore } from "@/store/user-store";
import { setCookie } from "@/utils/cookie";
import { SigninResponse } from "@/models/response-model";
import { useCartStore } from "@/store/cart-store";
import { User } from "@/models/user-model";

interface SignInProps {
  onClose: VoidFunction;
}

export const SignInSchema = z.object({
  identifier: z
    .string()
    .min(3, {
      message: "Identifier must have at least 3 or more characters",
    })
    .email({
      message: "Please enter a valid username or email address",
    }),
  password: z
    .string()
    .min(6, {
      message: "Password must have at least 6 or more characters",
    })
    .max(100, {
      message: "Password must be between 6 and 100 characters",
    }),
});

const useSignin = ({ onClose }: SignInProps) => {
  const [openModal, setOpenModal] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const setCart = useCartStore((state) => state.setCart);
  const { items: localCartItems } = useCartStore();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
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

  const handleSuccessSignUp = (response: SigninResponse) => {
    form.reset();
    setOpenModal(true);
    setCookie({ key: "jwt", value: response?.jwt });

    // Fetch user with cart
    fetchUserWithCart();
  };

  const { fetchData: fetchUserWithCart } = useFetch({
    path: "/api/users/me",
    autoFetch: false,
    params: { "populate[cart][populate][items][populate]": "product" },
    onSuccess: async (userData: User) => {
      // If user has local cart items and a backend cart, merge them
      if (localCartItems.length > 0 && userData.cart) {
        await mergeCartsAfterLogin(userData);

        // Fetch updated user data after merging carts
        await refreshUserCart();
      } else {
        // No merging needed
        setTimeout(() => {
          setOpenModal(false);
          onClose();
          setUser(userData);
          setCart(userData.cart);
        }, 1000);
      }
    },
  });

  const { fetchData: refreshUserCart } = useFetch<SigninResponse>({
    path: "/api/users/me",
    autoFetch: false,
    params: { "populate[cart][populate][items][populate]": "product" },
    onSuccess: (updatedUserData: User) => {
      setTimeout(() => {
        setOpenModal(false);
        onClose();
        setUser(updatedUserData);
        setCart(updatedUserData.cart);
      }, 1000);
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

  const { data, error, fetchData, isLoading } = useFetch({
    needToken: false,
    path: "/api/auth/local",
    method: "POST",
    autoFetch: false,
    onSuccess: handleSuccessSignUp,
  });

  const signin = async (userData: z.infer<typeof SignInSchema>) => {
    await fetchData({ body: userData });
  };

  return {
    signin,
    isLoading,
    data,
    error,
    form,
    openModal,
    setOpenModal,
  };
};

export default useSignin;
