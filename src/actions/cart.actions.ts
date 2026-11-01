"use server";

import { fail, ok, type ActionResult } from "@/models/action-result";
import type { CartItem } from "@/models/cart-model";
import { fromZodError, toActionError } from "@/lib/errors";
import * as cart from "@/services/cart.service";
import {
  addToCartSchema,
  mergeCartSchema,
  setCartItemQuantitySchema,
  type AddToCartInput,
  type MergeCartInput,
  type SetCartItemQuantityInput,
} from "@/validations/cart.schema";
import { requireUser } from "./helpers";

// Every action returns the fresh cart so the client store can reconcile.

export const addToCartAction = async (
  input: AddToCartInput
): Promise<ActionResult<CartItem[]>> => {
  const parsed = addToCartSchema.safeParse(input);
  if (!parsed.success) return fail(fromZodError(parsed.error));

  try {
    const { supabase } = await requireUser();
    const { productId, color, quantity } = parsed.data;
    await cart.addToCart(supabase, productId, color, quantity);
    return ok(await cart.getCart(supabase));
  } catch (error) {
    return fail(toActionError(error));
  }
};

export const setCartItemQuantityAction = async (
  input: SetCartItemQuantityInput
): Promise<ActionResult<CartItem[]>> => {
  const parsed = setCartItemQuantitySchema.safeParse(input);
  if (!parsed.success) return fail(fromZodError(parsed.error));

  try {
    const { supabase } = await requireUser();
    await cart.setCartItemQuantity(supabase, parsed.data.itemId, parsed.data.quantity);
    return ok(await cart.getCart(supabase));
  } catch (error) {
    return fail(toActionError(error));
  }
};

export const mergeGuestCartAction = async (
  lines: MergeCartInput
): Promise<ActionResult<CartItem[]>> => {
  const parsed = mergeCartSchema.safeParse(lines);
  if (!parsed.success) return fail(fromZodError(parsed.error));

  try {
    const { supabase } = await requireUser();
    await cart.mergeCart(supabase, parsed.data);
    return ok(await cart.getCart(supabase));
  } catch (error) {
    return fail(toActionError(error));
  }
};
