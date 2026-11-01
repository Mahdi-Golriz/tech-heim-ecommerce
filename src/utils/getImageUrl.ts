import { SUPABASE_URL } from "@/lib/env";

export type ImageBucket = "product-images" | "category-images";

/** Builds the public URL of an object in a public Supabase Storage bucket. */
export const getImageUrl = (path: string | null | undefined, bucket: ImageBucket) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
};
