"use client";
"use client";

import { Product } from "@/models/product-model";
import { PiStarFill } from "react-icons/pi";
import "swiper/css";
import "swiper/css/pagination";
import ProductDetailsBreadcrumb from "./product-breadcrumb";
import ProductImageSlider from "./product-images-slider";
import ProductServices from "./product-services";
import ProductColorSelector from "./product-color-selector";
import ProductSpecs from "./product-details";
import SimilarProducts from "./similar-products";
import { useEffect, useState } from "react";
import AddToCart from "./add-to-cart";

interface ProductDetailsProps {
  product: Product;
  productId: string;
}

const ProductDetails = ({ product, productId }: ProductDetailsProps) => {
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (product?.color?.length) {
      setSelectedColor(product.color[0]);
    }
  }, [product]);

  const categoryId = product?.category?.documentId;

  const productImages = product?.product_images;

  // if (isLoading) return <PageLoader fullPage />;

  return (
    <>
      <div className="container">
        <ProductDetailsBreadcrumb title={product?.title ?? ""} />
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-3 ">
        <div className="p-2 ">
          <ProductImageSlider productImages={productImages ?? []} />
          <div className="p-2">
            <h3 className="text-base font-medium my-3">{product?.title}</h3>
            <div>
              <span className="flex items-center gap-1 text-white bg-primary-700 size-fit py-1 px-2 rounded my-3">
                <PiStarFill color="white" />
                {product?.rate}
              </span>
            </div>
          </div>
        </div>
        <div className="py-5">
          <ProductServices />
          <ProductColorSelector
            colors={product?.color ?? []}
            setSelectedColor={setSelectedColor}
            selectedColor={selectedColor}
          />
          <ProductSpecs details={product?.details} />
        </div>
        <div className="sticky bottom-0 md:static bg-white z-40 lg:p-10 md:col-span-2 lg:col-auto">
          <AddToCart
            selectedColor={selectedColor}
            product={product!}
            discountPercentage={product?.discount_percentage ?? 0}
            price={product?.price ?? 0}
          />
        </div>
      </div>
      <SimilarProducts categoryId={categoryId ?? ""} productId={productId} />
    </>
  );
};

export default ProductDetails;
