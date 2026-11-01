import type { Json, Tables } from "@/types/database.types";
import type {
  Product,
  ProductImage,
  ProductSummary,
} from "@/models/product-model";
import type { Category } from "@/models/category-model";
import { getImageUrl } from "@/utils/getImageUrl";

type ImageRow = Pick<Tables<"product_images">, "id" | "storage_path" | "alt" | "position">;

export type ProductSummaryRow = Pick<
  Tables<"products">,
  | "id"
  | "slug"
  | "title"
  | "price"
  | "final_price"
  | "discount_percentage"
  | "rate"
  | "colors"
  | "is_new"
> & { images: ImageRow[] };

export type ProductRow = ProductSummaryRow &
  Pick<Tables<"products">, "description" | "details"> & {
    category: Pick<Tables<"categories">, "id" | "slug" | "title"> | null;
  };

const toImage = (row: ImageRow, fallbackAlt: string): ProductImage => ({
  id: row.id,
  url: getImageUrl(row.storage_path, "product-images"),
  alt: row.alt ?? fallbackAlt,
});

const sortedImages = (rows: ImageRow[], alt: string) =>
  [...rows].sort((a, b) => a.position - b.position).map((r) => toImage(r, alt));

// numeric columns can arrive as strings depending on the PostgREST setup
const num = (value: number | string) => Number(value);

const toDetails = (details: Json): Record<string, string> => {
  if (!details || typeof details !== "object" || Array.isArray(details)) return {};
  return Object.fromEntries(
    Object.entries(details).map(([key, value]) => [key, String(value ?? "")])
  );
};

export const toProductSummary = (row: ProductSummaryRow): ProductSummary => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  price: num(row.price),
  // generated column: never null in practice, but typed nullable by the generator
  finalPrice: num(row.final_price ?? row.price),
  discountPercentage: row.discount_percentage,
  rate: row.rate === null ? null : num(row.rate),
  colors: row.colors,
  isNew: row.is_new,
  image: sortedImages(row.images, row.title)[0] ?? null,
});

export const toProduct = (row: ProductRow): Product => ({
  ...toProductSummary(row),
  description: row.description,
  images: sortedImages(row.images, row.title),
  details: toDetails(row.details),
  category: row.category ?? { id: 0, slug: "", title: "" },
});

export const toCategory = (
  row: Pick<Tables<"categories">, "id" | "slug" | "title" | "description" | "thumbnail_path">
): Category => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  description: row.description,
  thumbnailUrl: getImageUrl(row.thumbnail_path, "category-images"),
});
