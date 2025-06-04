import { User, Wishlist } from "@/models/user-model";
import useFetch from "./useFetch";
import { useUserStore } from "@/store/user-store";
import { useState } from "react";
import { toast } from "sonner";

interface HandleAddToWishList {
  productId: string;
  userId: string;
  wishlist: Wishlist[];
}

type AddedToWishlist = "added" | "removed";

const useWishlist = () => {
  const setUser = useUserStore((state) => state.setUser);
  const [addedToWishlist, setAddedToWishlist] =
    useState<AddedToWishlist>("removed");

  // Fetch for user cart
  const { fetchData: fetchUserWishlist } = useFetch({
    path: "/api/users/me",
    autoFetch: false,
    skipRequestIfNoToken: true,
    onSuccess: (userData: User) => {
      setUser(userData);
    },
    params: {
      "populate[wishlists][populate][product][fields]": "documentId",
    },
  });

  const { fetchData: addToWishlist } = useFetch({
    autoFetch: false,
    skipRequestIfNoToken: true,
    onSuccess: () => {
      setAddedToWishlist("added");
      toast.success("Item was successfully added to your wishlist");
    },
  });

  const { fetchData: removeFormWishlist } = useFetch({
    autoFetch: false,
    skipRequestIfNoToken: true,
    onSuccess: () => {
      setAddedToWishlist("removed");
      toast.info("Item was successfully removed from your wishlist");
    },
  });

  const handleAddToWishList = async ({
    productId,
    userId,
    wishlist,
  }: HandleAddToWishList) => {
    const AvailableItem = wishlist?.find(
      (item) => item.product.documentId === productId
    );

    if (!!AvailableItem) {
      await removeFormWishlist({
        method: "DELETE",
        path: `/api/wishlists/${AvailableItem.documentId}`,
      });
    } else {
      await addToWishlist({
        method: "POST",
        path: "/api/wishlists",
        body: {
          data: {
            user: userId,
            product: productId,
          },
        },
      });
    }

    fetchUserWishlist();
  };

  return { handleAddToWishList, addedToWishlist };
};

export default useWishlist;
