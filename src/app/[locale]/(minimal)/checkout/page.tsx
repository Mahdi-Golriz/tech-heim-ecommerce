import Checkout from "@/components/checkout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Heim | Checkout",
};

const CheckoutPage = () => {
  return (
    <div className="container">
      <Checkout />
    </div>
  );
};

export default CheckoutPage;
