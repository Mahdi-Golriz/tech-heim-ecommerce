export interface OrderItem {
  id: string;
  productId: string | null;
  title: string;
  color: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  /** Short human-readable reference derived from the id. */
  number: string;
  status: "paid" | "cancelled";
  subtotal: number;
  discount: number;
  shippingMethod: string;
  shippingCost: number;
  total: number;
  cardLast4: string;
  deliveryAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export interface ShippingMethod {
  code: string;
  price: number;
}
