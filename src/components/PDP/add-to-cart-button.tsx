import { ProductSummary } from "@/models/product-model";
import Button from "../ui/button";
import useCart from "@/hooks/useCart";
import { useTranslations } from "next-intl";

interface AddToCartButtonProps {
  selectedColor: string;
  product: ProductSummary;
}

const AddToCartButton = ({ product, selectedColor }: AddToCartButtonProps) => {
  const { addToCart, isPending } = useCart();
  const t = useTranslations("products.pdp");
  return (
    <Button
      className="w-1/2 h-full lg:h-auto lg:w-full lg:order-2"
      disabled={isPending || !selectedColor}
      onClick={() => addToCart(product, selectedColor)}
    >
      {isPending ? t("addingToCart") : t("addToCart")}
    </Button>
  );
};

export default AddToCartButton;
