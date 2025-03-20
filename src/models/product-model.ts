interface ProductImage {
  url: string;
}

export interface Product {
  title: string;
  id: number;
  description?: string;
  on_sale?: boolean;
  discount_percentage?: number;
  price: number;
  product_images?: ProductImage[];
  colors?: string;
  new_collection?: boolean;
  rate?: number;
}
