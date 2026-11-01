import { create } from "zustand";
import type { Profile, SessionUser } from "@/models/user-model";

type SessionStatus = "loading" | "authenticated" | "guest";

interface UserState {
  status: SessionStatus;
  user: SessionUser | null;
  profile: Profile | null;
  wishlistIds: string[];
  setSession: (session: {
    user: SessionUser;
    profile: Profile | null;
    wishlistIds: string[];
  }) => void;
  setProfile: (profile: Profile) => void;
  setWishlistIds: (ids: string[]) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  status: "loading",
  user: null,
  profile: null,
  wishlistIds: [],
  setSession: ({ user, profile, wishlistIds }) =>
    set({ status: "authenticated", user, profile, wishlistIds }),
  setProfile: (profile) => set({ profile }),
  setWishlistIds: (wishlistIds) => set({ wishlistIds }),
  reset: () => set({ status: "guest", user: null, profile: null, wishlistIds: [] }),
}));
