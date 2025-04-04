import { Product } from "@/models/product-model";
import Image from "next/image";
import { FC } from "react";

const SaleCart: FC<Product> = ({
  title,
  discount_percentage: discountPercentage,
  price: totalPrice,
  product_images: productImages,
}) => {
  const salePrice = discountPercentage
    ? totalPrice - (discountPercentage / 100) * totalPrice
    : null;
  return (
    <div className="relative h-36 lg:h-60 flex flex-col p-2 justify-between rounded text-xs">
      <span className="absolute left-0 p-1 bg-secondary-100 text-secondary-400 text-xs rounded-r-lg">
        -{discountPercentage}%
      </span>
      <figure className="h-5/6">
        <Image
          src={
            productImages
              ? process.env.NEXT_PUBLIC_API_URL + productImages[0].url
              : ""
          }
          alt={title}
          className="mx-auto h-4/5 object-scale-down object-center"
          width={300}
          height={300}
        />
        <figcaption className="truncate lg:line-clamp-2 lg:whitespace-normal">
          {title}
        </figcaption>
      </figure>
      <div className="flex justify-between">
        <span className="text-gray-500 line-through">${totalPrice}</span>
        <span>${salePrice}</span>
      </div>
    </div>
  );
};

export default SaleCart;
