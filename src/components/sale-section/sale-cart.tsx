import Image, { StaticImageData } from "next/image";
import { FC } from "react";

export interface SaleCartProps {
  id: number;
  title: string;
  image: StaticImageData;
  discount: number;
  totalPrice: number;
  salePrice: number;
}

const SaleCart: FC<SaleCartProps> = ({
  title,
  image,
  discount,
  salePrice,
  totalPrice,
}) => (
  <div className="relative h-36 lg:h-60 flex flex-col p-2 justify-between rounded text-xs">
    <span className="absolute left-0 p-1 bg-secondary-100 text-secondary-400 text-xs rounded-r-lg">
      -{discount}%
    </span>
    <figure className="h-5/6">
      <Image
        src={image}
        alt={title}
        className="mx-auto h-4/5 object-scale-down object-center"
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

export default SaleCart;
