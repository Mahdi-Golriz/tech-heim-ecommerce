"use client";

import { Button, CustomBreadcrumb } from "@/components";
import useFetch from "@/hooks/useFetch";
import { Product } from "@/models/product-model";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  PiStarFill,
  PiStorefront,
  PiSealCheck,
  PiTruck,
  PiSealPercentFill,
} from "react-icons/pi";
import "swiper/css";
import "swiper/css/pagination";
import { Category } from "@/models/categories-model";

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

  console.log(product?.category?.documentId);
  const categoryId = product?.category?.documentId;

  const { data: similarProducts } = useFetch<Category>({
    path: `/api/categories/${categoryId}`,
    autoFetch: !!categoryId,
    params: { populate: "*" },
  });

  console.log(similarProducts?.products);

  const productImages = product?.product_images;

  const breadcrumbLinks = [
    { href: "/", title: "Home" },
    { href: "/products", title: "Products" },
    { href: "", title: product?.title ?? "" },
  ];

  return (
    <>
      <CustomBreadcrumb links={breadcrumbLinks} />

      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-3 ">
        <div className="p-2 ">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            pagination={{ clickable: true }}
          >
            {productImages?.map((image) => (
              <SwiperSlide key={image.documentId}>
                <div className="relative flex items-center justify-center h-52 mb-9 lg:mb-20 m-4">
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
          <div className="flex justify-between text-primary py-3 border-b">
            <div className="flex items-center gap-1">
              <PiStorefront size={20} />
              <span className="text-xs font-medium text-gray-500">
                In Stock
              </span>
            </div>
            <div className="flex items-center gap-1">
              <PiSealCheck size={20} />
              <span className="text-xs font-medium text-gray-500">
                Guaranteed
              </span>
            </div>
            <div className="flex items-center gap-1">
              <PiTruck size={20} />
              <span className="text-xs font-medium text-gray-500">
                Free Delivery
              </span>
            </div>
          </div>
          <div className="py-4 border-b">
            <h4>Select Color :</h4>
            <div className="flex gap-3 py-3">
              {product?.color?.map((item) => (
                <Button
                  variant="outline"
                  className="text-gray-700 border-gray-200 px-2"
                  key={item}
                >
                  <span
                    className="size-5 rounded-full border"
                    style={{ backgroundColor: item }}
                  ></span>
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div className="my-3">
            <ul className="list-disc marker:text-gray-500 px-9">
              {Object.entries(product?.details || {}).map(([key, value]) => (
                <li key={key} className="py-2">
                  <span className="inline-block text-gray-500 w-1/2">
                    {key}
                  </span>
                  <span className="w-1/2">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="sticky bottom-0 md:static bg-white z-40 lg:p-10 md:col-span-2 lg:col-auto">
          <div className="flex lg:flex-col left-0 w-full border-t p-4 md:border-none lg:gap-10 lg:shadow">
            <Button className="w-1/2 h-full lg:h-auto lg:w-full lg:order-2">
              Add to Cart
            </Button>
            {product?.discount_percentage ? (
              <div className="w-1/2 flex flex-wrap justify-between px-10 lg:w-full lg:px-5">
                <span className="line-through text-gray-500 h-fit font-light">
                  $ {product?.price}
                </span>
                <span className="text-secondary flex gap-1 h-fit items-center">
                  <PiSealPercentFill size={24} />
                  <span className="font-medium">
                    -{product?.discount_percentage}%
                  </span>
                </span>
                <p className="w-full text-center sm:text-start text-xl font-medium h-fit">
                  last price: $ {product?.price}
                </p>
              </div>
            ) : (
              <p className="w-full text-center text-xl font-medium h-fit">
                last price: $ {product?.price}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
