import Image, { StaticImageData } from "next/image";
import { FC } from "react";
import Button from "../ui/button";
import { PiHeartLight, PiPlusBold, PiStarFill } from "react-icons/pi";
import { cn } from "@/lib/utils";

type Color = "red" | "blue" | "green" | "black" | "white" | "gray";

export interface NewProduct {
  id: number;
  image: StaticImageData;
  title: string;
  colorVariant?: Color[];
  totalPrice: number;
  salePrice?: number;
  rate?: number;
}

const ProductCard: FC<NewProduct> = ({
  image,
  title,
  colorVariant,
  totalPrice,
  salePrice,
  rate,
}) => {
  return (
    <div className="group flex flex-col  gap-2 h-52 lg:h-80 px-2 pb-2 shadow-cart rounded">
      <figure className="custom-border-bottom h-2/3 shad py-3 ">
        <Image
          src={image}
          alt={title}
          className="object-contain h-full mx-auto group-hover:scale-105 transition-all"
        />
        <div className="absolute -right-1 top-1/3 group-hover:opacity-0">
          {colorVariant?.slice(0, 3).map((color) => (
            <span
              key={color}
              className={cn("block size-3 rounded-full border mb-1", {
                "bg-white": color === "white",
                "bg-gray-600": color === "gray",
                "bg-black": color === "black",
                "bg-green-950": color === "green",
                "bg-blue-800": color === "blue",
                "bg-red-700": color === "red",
              })}
            />
          ))}
          {(colorVariant?.length as number) > 3 && (
            <PiPlusBold
              size={9}
              className="mx-auto"
              color="gray"
              strokeWidth={10}
            />
          )}
        </div>
        <Button
          variant="icon"
          className="absolute top-1 p-0 [&_svg]:size-5 [&_svg]:text-blue-600 group-hover:opacity-100 h-fit opacity-0 transition-all"
        >
          <PiHeartLight />
        </Button>
      </figure>
      <p className="text-xs lg:text-base truncate lg:line-clamp-2 lg:whitespace-normal group-hover:text-primary-500">
        {title}
      </p>
      <div className="flex justify-between items-center mt-auto">
        <div>
          {salePrice ? (
            <>
              <p className="text-[10px] lg:text-sm line-through font-normal text-gray-600">
                $ {totalPrice}
              </p>
              <p className="text-xs lg:text-lg">$ {salePrice}</p>
            </>
          ) : (
            <span className="text-xs lg:text-lg">{totalPrice}</span>
          )}
        </div>
        <div className="h-full text-primary-500 font-medium flex gap-1 mb-0 items-end ">
          <PiStarFill className="lg:size-4" />
          <span className="h-5 ">{rate}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
