import Button from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useCartStore } from "@/store/cart-store";
import { useTranslations } from "next-intl";
import { PiShoppingCartSimpleLight } from "react-icons/pi";

interface ShoppingCartFooterProps {
  handleProceedToCart: VoidFunction;
}

const ShoppingCartFooter = ({
  handleProceedToCart,
}: ShoppingCartFooterProps) => {
  const t = useTranslations("shoppingCart");
  const { grandTotal } = useCartStore();
  return (
    <>
      {/* Footer - Total and Checkout Button */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col px-4 w-fit">
            <span className="font-medium ">{t("grandTotal")}</span>
            <span className="font-bold text-lg">${grandTotal.toFixed(2)}</span>
          </div>

          <Button
            className="w-2/3 py-2 text-base "
            asChild
            onClick={handleProceedToCart}
          >
            <Link href="/cart" passHref className="h-12">
              {t("cta")}
              <PiShoppingCartSimpleLight />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default ShoppingCartFooter;
