import PaymentForm from "@/components/payment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Heim | Payment",
};

const PaymentPage = () => {
  return (
    <div className="container">
      <PaymentForm />
    </div>
  );
};

export default PaymentPage;
