import Button from "@/components/ui/button";
import usePaymentDetails from "@/hooks/usePaymentDetails";
import { Link } from "@/i18n/routing";
import { PiShoppingCartSimpleLight } from "react-icons/pi";

interface ShoppingCartFooterProps {
  handleProceedToCart: VoidFunction;
}

const ShoppingCartFooter = ({
  handleProceedToCart,
}: ShoppingCartFooterProps) => {
  const { grandTotal } = usePaymentDetails();
  return (
    <>
      {/* Footer - Total and Checkout Button */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col px-4 w-fit">
            <span className="font-medium ">Grand total</span>
            <span className="font-bold text-lg">${grandTotal.toFixed(2)}</span>
          </div>

          <Button
            className="w-2/3 py-2 text-base "
            asChild
            onClick={handleProceedToCart}
          >
            <Link href="/cart" passHref className="h-12">
              Proceed to Cart
              <PiShoppingCartSimpleLight />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default ShoppingCartFooter;
