"use client";

import { cn } from "@/lib/cn";
import Button from "../ui/button";
import { ProductSummary } from "@/models/product-model";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import useCart from "@/hooks/useCart";
import { useTranslations } from "next-intl";

interface PLPAddToCartProps {
  product: ProductSummary;
  hasAddToCartButton: boolean;
}

const PLPAddToCart = ({ product, hasAddToCartButton }: PLPAddToCartProps) => {
  const { addToCart, isPending } = useCart();
  const t = useTranslations("products.cta");
  const defaultColor = product.colors[0] ?? "";

  const handleAddToCart = (e: React.MouseEvent) => {
    // The button sits inside a product <Link>
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultColor);
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
      disabled={isPending || !defaultColor}
    >
      <PiShoppingCartSimpleLight strokeWidth={8} className="hidden md:block" />
      {isPending ? t("addingToCart") : t("addToCart")}
    </Button>
  );
};

export default PLPAddToCart;
