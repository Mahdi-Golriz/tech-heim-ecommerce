import CheckoutForm from "@/components/checkout/checkout-form";
import CheckoutHeader from "@/components/checkout/checkout-header";

const CheckoutPage = () => {
  return (
    <div className="container">
      <CheckoutHeader />
      <CheckoutForm />
    </div>
  );
};

export default CheckoutPage;
