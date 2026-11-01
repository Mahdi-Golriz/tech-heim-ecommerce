import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ShippingMethod } from "@/models/order-model";

export interface CheckoutDetails {
  email?: string;
  address: string;
  shippingMethod?: ShippingMethod;
}

interface CheckoutState {
  checkoutDetails: CheckoutDetails | null;
  updateCheckoutDetails: (details: CheckoutDetails) => void;
  clearCheckoutDetails: () => void;
}

// sessionStorage: survives a reload of /payment but not a new tab/session
export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      checkoutDetails: null,
      updateCheckoutDetails: (details) => set({ checkoutDetails: details }),
      clearCheckoutDetails: () => set({ checkoutDetails: null }),
    }),
    {
      name: "checkout-details",
      storage: createJSONStorage(() => sessionStorage),
      // Rehydrated by SessionInitializer after mount to avoid SSR mismatches
      skipHydration: true,
    }
  )
);
