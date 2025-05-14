import { create } from "zustand";

export interface CheckoutDetails {
  email?: string;
  address: string;
  shippingCost?: number;
}

export type CheckoutStore = {
  checkoutDetails: CheckoutDetails | null;
  updateCheckoutDetails: (details: CheckoutDetails) => void;
  clearCheckoutDetails: () => void;
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  checkoutDetails: null,
  updateCheckoutDetails: (details: CheckoutDetails) =>
    set({ checkoutDetails: details }),
  clearCheckoutDetails: () => set({ checkoutDetails: null }),
}));
