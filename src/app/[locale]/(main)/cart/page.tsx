import { Cart } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Heim | Shopping Cart",
};

const CartPage = () => {
  return (
    <div className="container mb-10">
      <Cart />
    </div>
  );
};

export default CartPage;
