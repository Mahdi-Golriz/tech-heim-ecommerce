"use server";

import { z } from "zod";
import { fail, ok, type ActionResult } from "@/models/action-result";
import { fromZodError, toActionError } from "@/lib/errors";
import { getWishlistIds, toggleWishlistItem } from "@/services/wishlist.service";
import { requireUser } from "./helpers";

/** Toggles a product and returns the user's wishlisted product ids. */
export const toggleWishlistAction = async (
  productId: string
): Promise<ActionResult<string[]>> => {
  const parsed = z.uuid().safeParse(productId);
  if (!parsed.success) return fail(fromZodError(parsed.error));

  try {
    const { supabase, user } = await requireUser();
    await toggleWishlistItem(supabase, user.id, parsed.data);
    return ok(await getWishlistIds(supabase));
  } catch (error) {
    return fail(toActionError(error));
  }
};
