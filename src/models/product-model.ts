export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

/** What product cards need (listing, sliders, cart lines). */
export interface ProductSummary {
  id: string;
  slug: string;
  title: string;
  price: number;
  /** Price after discount, computed in the database. */
  finalPrice: number;
  discountPercentage: number | null;
  rate: number | null;
  colors: string[];
  isNew: boolean;
  image: ProductImage | null;
}

export interface Product extends ProductSummary {
  description: string | null;
  images: ProductImage[];
  details: Record<string, string>;
  category: { id: number; slug: string; title: string };
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
