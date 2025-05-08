import { Cart } from "./cart-model";

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
}

export type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};
