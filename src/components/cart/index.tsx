import CartHeader from "./cart-header";
import CartList from "./cart-list";
import CartPaymentDetails from "./cart-payment-details";

const Cart = () => {
  return (
    <>
      <CartHeader />
      <div className="flex flex-col md:flex-row md:gap-10">
        <CartList />
        <CartPaymentDetails />
      </div>
    </>
  );
};

export default Cart;
