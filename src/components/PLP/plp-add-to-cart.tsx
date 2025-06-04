"use client";

import { cn } from "@/lib/utils";
import Button from "../ui/button";
import { Product } from "@/models/product-model";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import useCart from "@/hooks/useAddToCart";
import { useTranslations } from "next-intl";

interface PLPAddToCartProps {
  product: Product;
  hasAddToCartButton: boolean;
}

const PLPAddToCart = ({ product, hasAddToCartButton }: PLPAddToCartProps) => {
  const { addToCart, isLoading } = useCart();
  const t = useTranslations("products.cta");
  const defaultColor = product.color?.at(0) || "";

  // Add a handler that stops event propagation
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default link behavior
    e.stopPropagation(); // Stop the event from bubbling up to parent elements
    addToCart({ product, quantity: 1, color: defaultColor });
  };

  return (
    <Button
      variant="outline"
      className={cn(
        "hidden w-fit mt-auto px-1 text-xs [&_svg]:size-4 lg:[&_svg]:size-6 lg:text-sm h-fit font-medium md:p-2",
        {
          "group-hover:flex": hasAddToCartButton,
        }
      )}
      onClick={handleAddToCart}
    >
      <PiShoppingCartSimpleLight strokeWidth={8} className="hidden md:block" />
      {isLoading ? t("addingToCart") : t("addToCart")}
    </Button>
  );
};

export default PLPAddToCart;
