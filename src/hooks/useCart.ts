"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import type { CartItem } from "@/models/cart-model";
import type { ProductSummary } from "@/models/product-model";
import type { ActionResult } from "@/models/action-result";
import {
  addToCartAction,
  setCartItemQuantityAction,
} from "@/actions/cart.actions";
import useActionError from "./useActionError";

/**
 * Cart operations for guests (local store only) and signed-in users
 * (optimistic store update → Server Action → reconcile or roll back).
 */
const useCart = () => {
  const t = useTranslations("products.toast");
  const actionError = useActionError();
  const isAuthenticated = useUserStore((s) => s.status === "authenticated");
  const [isPending, startTransition] = useTransition();

  const sync = (
    snapshot: CartItem[],
    request: () => Promise<ActionResult<CartItem[]>>,
    successMessage?: string
  ) => {
    startTransition(async () => {
      const result = await request();
      const { setItems } = useCartStore.getState();
      if (result.ok) {
        setItems(result.data);
        if (successMessage) toast.success(successMessage);
      } else {
        setItems(snapshot);
        toast.error(actionError(result.error));
      }
    });
  };

  const addToCart = (product: ProductSummary, color: string, quantity = 1) => {
    if (!color) return;
    const { items: snapshot, addItem } = useCartStore.getState();
    addItem(product, color, quantity);

    if (!isAuthenticated) {
      toast.success(t("addedToCart"));
      return;
    }
    sync(
      snapshot,
      () => addToCartAction({ productId: product.id, color, quantity }),
      t("addedToCart")
    );
  };

  /** Quantity <= 0 removes the line. */
  const setQuantity = (item: CartItem, quantity: number) => {
    const { items: snapshot, setQuantity: setLocalQuantity } = useCartStore.getState();
    setLocalQuantity(item.id, quantity);

    if (!isAuthenticated) return;
    sync(snapshot, () =>
      setCartItemQuantityAction({ itemId: item.id, quantity: Math.max(quantity, 0) })
    );
  };

  const removeItem = (item: CartItem) => setQuantity(item, 0);

  return { addToCart, setQuantity, removeItem, isPending };
};

export default useCart;
