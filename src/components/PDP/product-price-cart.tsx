import { PiSealPercentFill } from "react-icons/pi";
import Button from "../ui/button";
import { FC } from "react";

interface ProductPriceCartProps {
  discountPercentage: number;
  price: number;
}

const ProductPriceCart: FC<ProductPriceCartProps> = ({
  discountPercentage,
  price,
}) => {
  const salePrice = discountPercentage
    ? price - (discountPercentage / 100) * price
    : null;

  return (
    <div className="flex lg:flex-col left-0 w-full border-t p-4 md:border-none lg:gap-10 lg:shadow">
      <Button className="w-1/2 h-full lg:h-auto lg:w-full lg:order-2">
        Add to Cart
      </Button>
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
            last price: $ {salePrice}
          </p>
        </div>
      ) : (
        <p className="w-full text-center text-xl font-medium h-fit sm:px-5 lg:my-5">
          last price: $ {price}
        </p>
      )}
    </div>
  );
};
export default ProductPriceCart;
