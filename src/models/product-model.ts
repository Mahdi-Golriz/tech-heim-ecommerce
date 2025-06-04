export interface ProductImage {
  url: string;
  caption: string | null;
  documentId: string;
  name: string;
}

export interface Product {
  title: string;
  id?: number;
  documentId: string;
  description?: string;
  on_sale?: boolean;
  discount_percentage?: number;
  price: number;
  product_images?: ProductImage[];
  colors?: string;
  color?: string[];
  new_collection?: boolean;
  rate?: number;
  slug?: string;
  category?: {
    title: string;
    id: number;
    documentId: string;
  };
  details?: Record<string, string>;
}
