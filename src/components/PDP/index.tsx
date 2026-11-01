"use client";

import { Product, ProductSummary } from "@/models/product-model";
import { PiStarFill } from "react-icons/pi";
import "swiper/css";
import "swiper/css/pagination";
import ProductDetailsBreadcrumb from "./product-breadcrumb";
import ProductImageSlider from "./product-images-slider";
import ProductServices from "./product-services";
import ProductColorSelector from "./product-color-selector";
import ProductSpecs from "./product-details";
import SimilarProducts from "./similar-products";
import { useState } from "react";
import AddToCart from "./add-to-cart";
import WishlistButton from "../wishlist-button/wishlist-button";

interface ProductDetailsProps {
  product: Product;
  similarProducts: ProductSummary[];
}

const ProductDetails = ({ product, similarProducts }: ProductDetailsProps) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");

  return (
    <>
      <div className="container">
        <ProductDetailsBreadcrumb title={product.title} />
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-3 ">
        <div className="p-2 relative">
          <WishlistButton className="z-10" productId={product.id} />
          <ProductImageSlider productImages={product.images} />
          <div className="p-2">
            <h1 className="text-base font-medium my-3">{product.title}</h1>
            {product.rate !== null && (
              <div>
                <span className="flex items-center gap-1 text-white bg-primary-700 size-fit py-1 px-2 rounded my-3">
                  <PiStarFill color="white" />
                  {product.rate}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="py-5">
          <ProductServices />
          <ProductColorSelector
            colors={product.colors}
            setSelectedColor={setSelectedColor}
            selectedColor={selectedColor}
          />
          <ProductSpecs details={product.details} />
        </div>
        <div className="sticky bottom-0 md:static bg-white z-40 lg:p-10 md:col-span-2 lg:col-auto">
          <AddToCart selectedColor={selectedColor} product={product} />
        </div>
      </div>
      {similarProducts.length > 0 && <SimilarProducts products={similarProducts} />}
    </>
  );
};

export default ProductDetails;
