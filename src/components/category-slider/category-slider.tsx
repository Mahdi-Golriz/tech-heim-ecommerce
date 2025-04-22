"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Category } from "@/models/categories-model";
import useFetch from "@/hooks/useFetch";
import { DataResponse } from "@/models/response-model";

const CategoryCard = ({ title, thumbnail }: Category) => (
  <Link
    href="/"
    className="block h-28 sm:h-36 lg:h-48 p-2 shadow-cart rounded-lg"
  >
    <Image
      src={process.env.NEXT_PUBLIC_API_URL + thumbnail.url}
      alt={title}
      width={300}
      height={300}
      className="mx-auto h-3/4 object-scale-down object-center"
    />
    <p className="text-center text-xs my-2 sm:text-base whitespace-nowrap truncate">
      {title}
    </p>
  </Link>
);

const CategorySlider = () => {
  const { data: categories } = useFetch<DataResponse<Category[]>>({
    path: "/api/categories",
    params: {
      populate: "*",
    },
  });

  return (
    <div className="my-10 pl-4 sm:container ">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        grabCursor
        breakpoints={{
          320: { slidesPerView: 3.5, spaceBetween: 0 },
          640: { slidesPerView: 4, spaceBetween: 12 },
          1024: { slidesPerView: 5, spaceBetween: 12 },
          1280: { slidesPerView: 6, spaceBetween: 12 },
        }}
      >
        {categories?.data.map((category) => (
          <SwiperSlide key={category.id} className="p-2">
            <CategoryCard {...category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategorySlider;
