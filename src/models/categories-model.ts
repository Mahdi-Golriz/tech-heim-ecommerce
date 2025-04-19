import { Product } from "./product-model";

export interface Category {
  title: string;
  documentId: string;
  id: number;
  description: string;
  thumbnail: { url: string };
  products?: Product[];
}
