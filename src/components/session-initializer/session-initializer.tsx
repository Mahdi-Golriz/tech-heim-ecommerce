"use client";

import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getProfile } from "@/services/profile.service";
import { getWishlistIds } from "@/services/wishlist.service";
import { getCart } from "@/services/cart.service";
import { mergeGuestCartAction } from "@/actions/cart.actions";
import { useUserStore } from "@/store/user-store";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";

/**
 * Keeps the client stores in sync with the Supabase auth session. Runs on the
 * client so statically rendered pages stay static. Reads go through RLS.
 */
const SessionInitializer = () => {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useCheckoutStore.persist.rehydrate();

    const supabase = createClient();

    const loadUserData = async (user: User, mergeGuestCart: boolean) => {
      const guestItems = useCartStore.getState().items;

      if (mergeGuestCart && guestItems.length) {
        await mergeGuestCartAction(
          guestItems.map(({ productId, color, quantity }) => ({
            productId,
            color,
            quantity,
          }))
        );
      }

      const [profile, wishlistIds, cart] = await Promise.all([
        getProfile(supabase, user.id),
        getWishlistIds(supabase),
        getCart(supabase),
      ]);

      useUserStore.getState().setSession({
        user: { id: user.id, email: user.email ?? "" },
        profile,
        wishlistIds,
      });
      useCartStore.getState().setItems(cart);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const { status, user: currentUser, reset } = useUserStore.getState();

      if (!session?.user) {
        if (event === "SIGNED_OUT") useCartStore.getState().clear();
        reset();
        return;
      }

      // SIGNED_IN also fires on tab refocus; only act on real changes
      if (status === "authenticated" && currentUser?.id === session.user.id) return;

      const user = session.user;
      // Only a fresh sign-in by a guest merges the local cart; a reload doesn't
      const mergeGuestCart = event === "SIGNED_IN" && status === "guest";

      // Defer: awaiting Supabase calls inside this callback can deadlock
      setTimeout(() => {
        loadUserData(user, mergeGuestCart).catch((error) => {
          console.error("Failed to load user data:", error);
        });
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
};

export default SessionInitializer;
