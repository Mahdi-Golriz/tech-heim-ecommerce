import { Cart } from "./cart-model";
import { Product } from "./product-model";

interface ItemsDetails {
  itemNum: number;
  itemTitle: string;
  itemColor: string;
  itemPrice: number;
}

export interface Order {
  id: number;
  documentId: string;
  totalPrice: 83.2;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cardNumber: string;
  deliveryAddress: string;
  itemsDetails: ItemsDetails[];
}

export interface Wishlist {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  product: Product;
}

export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  cart: Cart;
  address: string;
  postalCode: string;
  fullName: string;
  orders: Order[];
  wishlists: Wishlist[];
}

export type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};
