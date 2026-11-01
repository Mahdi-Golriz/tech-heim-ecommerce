"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import useAuthModalStore from "@/store/auth-modal-store";
import { toggleWishlistAction } from "@/actions/wishlist.actions";
import useActionError from "./useActionError";

const useWishlist = (productId: string) => {
  const t = useTranslations("wishlist");
  const actionError = useActionError();
  const isAuthenticated = useUserStore((s) => s.status === "authenticated");
  const isWishlisted = useUserStore((s) => s.wishlistIds.includes(productId));
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const { wishlistIds: snapshot, setWishlistIds } = useUserStore.getState();
    const adding = !snapshot.includes(productId);
    setWishlistIds(
      adding ? [...snapshot, productId] : snapshot.filter((id) => id !== productId)
    );

    startTransition(async () => {
      const result = await toggleWishlistAction(productId);
      if (result.ok) {
        setWishlistIds(result.data);
        if (adding) toast.success(t("added"));
        else toast.info(t("removed"));
      } else {
        setWishlistIds(snapshot);
        toast.error(actionError(result.error));
      }
    });
  };

  return { isWishlisted, toggle, isPending };
};

export default useWishlist;
