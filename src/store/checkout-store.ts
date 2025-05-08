import { create } from "zustand";

interface CheckoutStore {
  email: string;
  setEmail: (email: string) => void;
  clearEmail: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  email: "",
  setEmail: (email) => set({ email }),
  clearEmail: () => set({ email: "" }),
}));
