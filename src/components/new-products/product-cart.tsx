import Image from "next/image";
import { PiPlusBold, PiStarFill } from "react-icons/pi";
import { Product } from "@/models/product-model";
import { cn } from "@/lib/cn";
import { Link } from "@/i18n/routing";
import PLPAddToCart from "../PLP/plp-add-to-cart";
import WishlistButton from "../wishlist-button/wishlist-button";

interface ProductCartProps {
  product: Product;
  hasAddToCartButton: boolean;
  plpCard?: boolean;
  newProductCard?: boolean;
  wishlistButtonPosition: "topLeft" | "bottomRight";
}

const ProductCard = ({
  product,
  hasAddToCartButton,
  wishlistButtonPosition,
}: ProductCartProps) => {
  const {
    product_images: productImages,
    title,
    colors: colorVariant,
    price: totalPrice,
    discount_percentage: discountPercentage,
    rate,
    documentId,
  } = product;
  const salePrice = discountPercentage
    ? totalPrice - (discountPercentage / 100) * totalPrice
    : null;

  const colorVariantArray = colorVariant?.split(" ");

  return (
    <Link href={`/products/${documentId}`}>
      <div className="relative group flex flex-col gap-2 h-52 lg:h-80 px-2 pb-2 shadow-custom rounded">
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
        <p className="text-xs lg:text-base truncate lg:line-clamp-2 lg:whitespace-normal group-hover:text-primary-500 lg:leading-tight">
          {title}
        </p>
        <div
          className={cn("flex justify-between items-center mt-auto", {
            "group-hover:hidden": hasAddToCartButton,
          })}
        >
          <div className="">
            {salePrice ? (
              <>
                <p className="text-[10px] lg:text-sm line-through font-normal text-gray-600">
                  $ {totalPrice.toFixed(2)}
                </p>
                <p className="text-xs lg:text-lg">$ {salePrice.toFixed(2)}</p>
              </>
            ) : (
              <span className="text-xs lg:text-lg">
                $ {totalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="h-full text-primary-500 font-medium flex gap-1 mb-0 items-end pb-1">
            <PiStarFill className="lg:size-4" />
            <span className="h-5">{rate}</span>
          </div>
        </div>
        <PLPAddToCart
          hasAddToCartButton={hasAddToCartButton}
          product={product}
        />
        <WishlistButton
          className="group-hover:opacity-100 h-fit opacity-0"
          relativePosition={wishlistButtonPosition}
          productId={product.documentId}
        />
      </div>
    </Link>
  );
};

export default ProductCard;
