import { create } from "zustand";

interface AuthModalStore {
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  toggleAuthModal: () => void;
}

const setOpen = (open: boolean) => {
  document.body.classList.toggle("overflow-hidden", open);
  return { isAuthModalOpen: open };
};

const useAuthModalStore = create<AuthModalStore>((set, get) => ({
  isAuthModalOpen: false,
  openAuthModal: () => set(setOpen(true)),
  closeAuthModal: () => set(setOpen(false)),
  toggleAuthModal: () => set(setOpen(!get().isAuthModalOpen)),
}));

export default useAuthModalStore;
