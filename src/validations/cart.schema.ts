import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.uuid(),
  color: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const setCartItemQuantitySchema = z.object({
  itemId: z.uuid(),
  quantity: z.number().int().min(0).max(99),
});

export const mergeCartSchema = z
  .array(
    z.object({
      productId: z.uuid(),
      color: z.string().min(1),
      quantity: z.number().int().min(1).max(99),
    })
  )
  .max(100);

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type SetCartItemQuantityInput = z.infer<typeof setCartItemQuantitySchema>;
export type MergeCartInput = z.infer<typeof mergeCartSchema>;
