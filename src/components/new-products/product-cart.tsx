import Image from "next/image";
import { FC } from "react";
import Button from "../ui/button";
import {
  PiHeartLight,
  PiPlusBold,
  PiStarFill,
  PiShoppingCartSimpleLight,
} from "react-icons/pi";
import { Product } from "@/models/product-model";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const ProductCard: FC<Product> = ({
  product_images: productImages,
  title,
  colors: colorVariant,
  price: totalPrice,
  discount_percentage: discountPercentage,
  rate,
  hasCartButton,
}) => {
  const t = useTranslations("products");
  const salePrice = discountPercentage
    ? totalPrice - (discountPercentage / 100) * totalPrice
    : null;

  const colorVariantArray = colorVariant?.split(" ");

  return (
    <div className="relative group flex flex-col gap-2 h-52 lg:h-80 px-2 pb-2 shadow-cart rounded">
      <figure className="custom-border-bottom h-2/3 shad py-3">
        <Image
          src={
            productImages
              ? process.env.NEXT_PUBLIC_API_URL + productImages[0].url
              : ""
          }
          alt={title}
          className="object-contain h-full mx-auto group-hover:scale-105 transition-all"
          width={300}
          height={300}
        />
        <div className="absolute -right-1 top-1/3 group-hover:opacity-0">
          {colorVariantArray ? (
            <>
              {colorVariantArray.map((color) => (
                <span
                  key={color}
                  className="block size-3 rounded-full border mb-1"
                  style={{ backgroundColor: color }}
                />
              ))}
              {colorVariantArray.length > 3 && (
                <PiPlusBold
                  size={9}
                  className="mx-auto"
                  color="gray"
                  strokeWidth={10}
                />
              )}
            </>
          ) : null}
        </div>
      </figure>
      {discountPercentage ? (
        <span className="absolute left-0 top-2 p-1 bg-secondary-100 text-secondary-400 text-xs rounded-r-lg group-hover:opacity-0 transition-all">
          -{discountPercentage}%
        </span>
      ) : null}
      <p className="text-xs lg:text-base truncate lg:line-clamp-2 lg:whitespace-normal group-hover:text-primary-500">
        {title}
      </p>
      <div
        className={cn("flex justify-between items-center mt-auto", {
          "group-hover:hidden": hasCartButton,
        })}
      >
        <div>
          {salePrice ? (
            <>
              <p className="text-[10px] lg:text-sm line-through font-normal text-gray-600">
                $ {totalPrice}
              </p>
              <p className="text-xs lg:text-lg">$ {salePrice}</p>
            </>
          ) : (
            <span className="text-xs lg:text-lg">$ {totalPrice}</span>
          )}
        </div>
        <div className="h-full text-primary-500 font-medium flex gap-1 mb-0 items-end pb-1">
          <PiStarFill className="lg:size-4" />
          <span className="h-5">{rate}</span>
        </div>
      </div>
      <Button
        variant="outline"
        className={cn(
          "hidden w-fit mt-auto px-2 text-xs [&_svg]:size-4 lg:[&_svg]:size-6 lg:text-sm h-fit font-medium ",
          {
            "group-hover:flex": hasCartButton,
          }
        )}
      >
        <PiShoppingCartSimpleLight strokeWidth={8} />
        {t("cta.addToCart")}
      </Button>
      <Button
        variant="icon"
        className={cn(
          "absolute p-0 [&_svg]:size-5 [&_svg]:text-blue-600 group-hover:opacity-100 h-fit opacity-0",
          hasCartButton ? "bottom-4 right-3" : "top-1"
        )}
      >
        <PiHeartLight />
      </Button>
    </div>
  );
};

export default ProductCard;
