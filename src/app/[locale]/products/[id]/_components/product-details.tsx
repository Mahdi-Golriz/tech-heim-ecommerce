"use client";

import { CustomBreadcrumb } from "@/components";
import useFetch from "@/hooks/useFetch";
import { Product } from "@/models/product-model";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

interface Params {
  id: string;
  locale: string;
  [key: string]: string;
}

const ProductDetails = () => {
  const params = useParams<Params>();

  const productId = params.id;
  const { data: product } = useFetch<Product>({
    path: `/api/products/${productId}`,
    params: { populate: "*" },
  });

  const productImages = product?.product_images;
  console.log(productImages);
  const breadcrumbLinks = [
    { href: "/", title: "Home" },
    { href: "/products", title: "Products" },
    { href: "", title: product?.category?.title ?? "" },
  ];

  return (
    <>
      <CustomBreadcrumb links={breadcrumbLinks} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-2">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            pagination={{ clickable: true }}
          >
            {productImages?.map((image) => (
              <SwiperSlide key={image.documentId}>
                <div className="relative flex items-center justify-center h-52 mb-8 m-4">
                  <Image
                    fill
                    className="absolute object-scale-down"
                    src={process.env.NEXT_PUBLIC_API_URL + image.url}
                    alt={image.name}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <h3 className="text-base font-medium">{product?.title}</h3>
      </div>
    </>
  );
};

export default ProductDetails;
