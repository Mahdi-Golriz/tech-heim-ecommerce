"use client";

import useFetch from "@/hooks/useFetch";
import { useUserStore } from "@/store/user-store";
import { User as IUser } from "@/models/user-model";

const UserInitializer = () => {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const shouldFetch = !user;

  const handleAuthenticatedUserData = (userData: IUser) => {
    setUser(userData);
  };

  const handleUnauthenticatedUser = () => {
    setUser(null);
  };

  useFetch({
    path: "/api/users/me",
    autoFetch: shouldFetch,
    onSuccess: handleAuthenticatedUserData,
    onError: handleUnauthenticatedUser,
  });

  return null;
};

export default UserInitializer;
