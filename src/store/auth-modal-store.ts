import { create } from "zustand";

interface AuthModalStore {
  isAuthModalOpen: boolean;
  toggleAuthModal: () => void;
}

export const useAuthModalStore = create<AuthModalStore>((set, get) => ({
  isAuthModalOpen: false,
  toggleAuthModal: () => {
    const isOpen = get().isAuthModalOpen;
    document.body.classList.toggle("overflow-hidden", !isOpen);
    set({ isAuthModalOpen: !isOpen });
  },
}));
