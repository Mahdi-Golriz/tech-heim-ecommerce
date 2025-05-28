import { Cart } from "./cart-model";

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
}

export type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};
