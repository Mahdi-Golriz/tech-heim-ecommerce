"use client";

import useFetch from "@/hooks/useFetch";
import { Product } from "@/models/product-model";
import { useParams } from "next/navigation";
import { PiStarFill } from "react-icons/pi";
import "swiper/css";
import "swiper/css/pagination";
import { DataResponse } from "@/models/response-model";
import ProductDetailsBreadcrumb from "./product-breadcrumb";
import ProductImageSlider from "./product-images-slider";
import ProductServices from "./product-services";
import ProductColorSelector from "./product-color-selector";
import ProductSpecs from "./product-details";
import ProductPriceCart from "./product-price-cart";
import SimilarProducts from "./similar-products";

interface Params {
  id: string;
  locale: string;
  [key: string]: string;
}

const ProductDetails = () => {
  const params = useParams<Params>();

  const productId = params.id;
  const { data: productResponse } = useFetch<DataResponse<Product>>({
    path: `/api/products/${productId}`,
    params: { populate: "*" },
  });

  const product = productResponse?.data;

  const categoryId = product?.category?.documentId;

  const productImages = product?.product_images;

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
          <ProductColorSelector colors={product?.color ?? []} />
          <ProductSpecs details={product?.details} />
        </div>
        <div className="sticky bottom-0 md:static bg-white z-40 lg:p-10 md:col-span-2 lg:col-auto">
          <ProductPriceCart
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
