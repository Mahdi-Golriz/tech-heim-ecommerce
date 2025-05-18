import { Product } from "./product-model";

export interface CartItem {
  id: number;
  documentId: string;
  quantity: number;
  color: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  product: Product;
}

export interface Cart {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  items: CartItem[];
}

export type CartStore = {
  items: CartItem[];
  subtotalPrice: number;
  discount: number;
  grandTotal: number;
  totalItems: number;
  setCart: (cart: Cart) => void;
  addItem: (newItem: CartItem) => void;
  removeItem: (documentId: string, color: string) => void;
  updateQuantity: (documentId: string, color: string, quantity: number) => void;
  clearCart: () => void;
};
