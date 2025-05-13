import { Link } from "@/i18n/routing";
import Button from "../ui/button";
import CartHeader from "./cart-header";
import CartList from "./cart-list";
import CartPaymentDetails from "./cart-payment-details";

const Cart = () => {
  return (
    <>
      <CartHeader />
      <div className="flex flex-col md:flex-row md:gap-10">
        <CartList />
        <div className="my-5 md:shadow-custom h-fit p-4 md:my-0 grow">
          <CartPaymentDetails />
          <Button className="my-5 w-full" asChild>
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Cart;
