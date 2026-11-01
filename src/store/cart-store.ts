import { create } from "zustand";
import { persist } from "zustand/middleware";
import { guestCartItemId, type CartItem } from "@/models/cart-model";
import type { ProductSummary } from "@/models/product-model";

interface CartState {
  items: CartItem[];
  /** Replace the whole cart (server is the source of truth when signed in). */
  setItems: (items: CartItem[]) => void;
  addItem: (product: ProductSummary, color: string, quantity: number) => void;
  /** Quantity <= 0 removes the line. */
  setQuantity: (itemId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      setItems: (items) => set({ items }),

      addItem: (product, color, quantity) =>
        set(({ items }) => {
          const existing = items.find(
            (item) => item.productId === product.id && item.color === color
          );
          if (existing) {
            return {
              items: items.map((item) =>
                item === existing
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [
              ...items,
              {
                id: guestCartItemId(product.id, color),
                productId: product.id,
                color,
                quantity,
                product,
              },
            ],
          };
        }),

      setQuantity: (itemId, quantity) =>
        set(({ items }) => ({
          items:
            quantity <= 0
              ? items.filter((item) => item.id !== itemId)
              : items.map((item) =>
                  item.id === itemId ? { ...item, quantity } : item
                ),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      version: 2,
      // v1 held Strapi-shaped items; start fresh instead of crashing on them
      migrate: () => ({ items: [] }),
      // Rehydrated by SessionInitializer after mount to avoid SSR mismatches
      skipHydration: true,
    }
  )
);

// Derived values as selectors, so components re-render when they change.
export const selectTotalItems = (s: CartState) =>
  s.items.reduce((total, item) => total + item.quantity, 0);

export const selectSubtotal = (s: CartState) =>
  s.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

export const selectGrandTotal = (s: CartState) =>
  s.items.reduce((total, item) => total + item.product.finalPrice * item.quantity, 0);

export const selectDiscount = (s: CartState) => selectSubtotal(s) - selectGrandTotal(s);
