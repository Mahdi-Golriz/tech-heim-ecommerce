"use client";

import { Button, CustomBreadcrumb } from "@/components";
import useFetch from "@/hooks/useFetch";
import { Product } from "@/models/product-model";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
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
import SectionHeader from "../section-header/section-header";
import ProductCard from "../new-products/product-cart";
import { DataResponse } from "@/models/response-model";

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

  const { data } = useFetch<DataResponse<Category>>({
    path: `/api/categories/${categoryId}`,
    autoFetch: !!categoryId,
    params: { "populate[products][populate][0]": "product_images" },
  });

  const similarProducts = data?.data.products?.filter(
    (item) => item.documentId !== productId
  );

  const productImages = product?.product_images;

  const breadcrumbLinks = [
    { href: "/", title: "Home" },
    { href: "/products", title: "Products" },
    { href: "", title: product?.title ?? "" },
  ];

  return (
    <>
      <div className="container">
        <CustomBreadcrumb links={breadcrumbLinks} />
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-3 ">
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
              <div className="w-1/2 flex flex-wrap justify-around lg:w-full">
                <span className="line-through text-gray-500 h-fit font-light">
                  $ {product?.price}
                </span>
                <span className="text-secondary flex gap-1 h-fit items-center">
                  <PiSealPercentFill size={24} />
                  <span className="font-medium">
                    -{product?.discount_percentage}%
                  </span>
                </span>
                <p className="w-full text-center sm:text-start text-xl font-medium h-fit sm:px-5 lg:my-5">
                  last price: $ {product?.price}
                </p>
              </div>
            ) : (
              <p className="w-full text-center text-xl font-medium h-fit sm:px-5 lg:my-5">
                last price: $ {product?.price}
              </p>
            )}
          </div>
        </div>
      </div>
      <SectionHeader title="Similar Products" />
      <div className="container py-10">
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          navigation
          grabCursor
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 12 },
            640: { slidesPerView: 2, spaceBetween: 12 },
            1024: { slidesPerView: 4, spaceBetween: 10 },
            1280: { slidesPerView: 5, spaceBetween: 10 },
          }}
        >
          {similarProducts?.slice(0, 6).map((product) => (
            <SwiperSlide key={product.id} className="p-2">
              <ProductCard {...product} hasCartButton />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default ProductDetails;
