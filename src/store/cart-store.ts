import { CartStore } from "@/models/cart-model";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      discount: 0,
      grandTotal: 0,
      totalItems: 0,
      subtotalPrice: 0,

      addItem: (newItem) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) =>
            item.product.documentId === newItem.product.documentId &&
            item.color === newItem.color
        );

        if (existingItemIndex >= 0) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...items, newItem] });
        }
      },

      setCart: (cart) => {
        const items = cart?.items || [];
        set({ items });
      },

      removeItem: (documentId: string, color: string) => {
        const { items } = get();
        const updatedItems = items.filter(
          (item) =>
            item.product.documentId !== documentId || item.color !== color
        );

        set({ items: updatedItems });
      },

      updateQuantity: (documentId: string, color: string, quantity: number) => {
        const { items } = get();
        const itemIndex = items.findIndex(
          (item) =>
            item.product.documentId === documentId && item.color === color
        );
        const updatedItems = [...items];
        updatedItems[itemIndex].quantity += quantity;
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    { name: "cart-storage" }
  )
);

// Derived states: Automatically update with items change
useCartStore.subscribe((state) => {
  state.totalItems = state.items.reduce(
    (totalNumber, item) => totalNumber + item.quantity,
    0
  );

  state.subtotalPrice = state.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  state.discount = state.items.reduce(
    (total, item) =>
      total +
      ((item.product.price * (item.product.discount_percentage || 0)) / 100) *
        item.quantity,
    0
  );

  state.grandTotal = state.subtotalPrice - state.discount;
});
