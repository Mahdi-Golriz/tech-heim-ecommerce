import type { TypedSupabaseClient } from "@/lib/supabase/types";
import { fromPostgrestError } from "@/lib/errors";
import { toCategory } from "@/mappers/product.mapper";
import type { Category } from "@/models/category-model";

export const listCategories = async (
  client: TypedSupabaseClient
): Promise<Category[]> => {
  const { data, error } = await client
    .from("categories")
    .select("id, slug, title, description, thumbnail_path")
    .order("position");

  if (error) throw fromPostgrestError(error);
  return data.map(toCategory);
};
