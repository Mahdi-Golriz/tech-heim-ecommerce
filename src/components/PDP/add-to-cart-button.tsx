import { Product } from "@/models/product-model";
import Button from "../ui/button";
import useCart from "@/hooks/useAddToCart";
import { useTranslations } from "next-intl";

interface AddToCartButtonProps {
  selectedColor: string;
  product: Product;
}

const AddToCartButton = ({ product, selectedColor }: AddToCartButtonProps) => {
  const { addToCart, isLoading } = useCart();
  const t = useTranslations("products.pdp");
  return (
    <Button
      className="w-1/2 h-full lg:h-auto lg:w-full lg:order-2"
      onClick={() => addToCart({ product, color: selectedColor })}
    >
      {isLoading ? t("addingToCart") : t("addToCart")}
    </Button>
  );
};

export default AddToCartButton;
