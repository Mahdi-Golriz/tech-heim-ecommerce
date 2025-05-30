"use client";

import useFetch from "@/hooks/useFetch";
import { useUserStore } from "@/store/user-store";
import { User as IUser } from "@/models/user-model";
import { useCartStore } from "@/store/cart-store";

const UserInitializer = () => {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const setCart = useCartStore((state) => state.setCart);
  const shouldFetch = !user;

  const handleAuthenticatedUserData = (userData: IUser) => {
    setUser(userData);
    setCart(userData.cart);
  };

  const handleUnauthenticatedUser = () => {
    setUser(null);
  };

  useFetch({
    path: "/api/users/me",
    autoFetch: shouldFetch,
    onSuccess: handleAuthenticatedUserData,
    onError: handleUnauthenticatedUser,
    skipRequestIfNoToken: true,
    params: {
      "populate[cart][populate][items][populate][product][populate]":
        "product_images",
      "populate[wishlists][populate][product][fields]": "documentId",
    },
  });

  return null;
};

export default UserInitializer;
