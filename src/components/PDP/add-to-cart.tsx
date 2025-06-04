import { PiSealPercentFill } from "react-icons/pi";
import { FC } from "react";
import AddToCartButton from "./add-to-cart-button";
import { Product } from "@/models/product-model";
import { useTranslations } from "next-intl";

interface AddToCartProps {
  discountPercentage: number;
  price: number;
  selectedColor: string;
  product: Product;
}

const AddToCart: FC<AddToCartProps> = ({
  discountPercentage,
  price,
  selectedColor,
  product,
}) => {
  const t = useTranslations("products.pdp");
  const salePrice = discountPercentage
    ? price - (discountPercentage / 100) * price
    : null;

  return (
    <div className="flex lg:flex-col left-0 w-full border-t p-4 md:border-none lg:gap-10 lg:shadow">
      <AddToCartButton product={product} selectedColor={selectedColor} />
      {discountPercentage ? (
        <div className="w-1/2 flex flex-wrap justify-around lg:w-full">
          <span className="line-through text-gray-500 h-fit font-light">
            $ {price}
          </span>
          <span className="text-secondary flex gap-1 h-fit items-center">
            <PiSealPercentFill size={24} />
            <span className="font-medium">-{discountPercentage}%</span>
          </span>
          <p className="w-full text-center sm:text-start text-xl font-medium h-fit sm:px-5 lg:my-5">
            {t("lastPrice")} {salePrice}
          </p>
        </div>
      ) : (
        <p className="w-full text-center text-xl font-medium h-fit sm:px-5 lg:my-5">
          {t("lastPrice")} {price}
        </p>
      )}
    </div>
  );
};
export default AddToCart;
