"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import Image, { StaticImageData } from "next/image";
import accessory from "@/assets/category-images/accessory.png";
import cameras from "@/assets/category-images/cameras.png";
import game from "@/assets/category-images/game.png";
import laptops from "@/assets/category-images/laptops.png";
import mobile from "@/assets/category-images/mobile.png";
import smartWatch from "@/assets/category-images/smart-watch.png";
import { Link } from "@/i18n/routing";

type Category = {
  id: number;
  name: string;
  image: StaticImageData;
};

const categories = [
  { id: 1, name: "Accessories", image: accessory },
  { id: 2, name: "Wearables", image: smartWatch },
  { id: 3, name: "Gaming", image: game },
  { id: 4, name: "Smartphones", image: mobile },
  { id: 5, name: "Laptops", image: laptops },
  { id: 6, name: "Cameras", image: cameras },
];

const CategoryCard = ({ image, name }: Category) => (
  <Link href="/" className="block">
    <div className="relative w-auto p-2 shadow-cart rounded-lg">
      <Image src={image} alt={name} className="h-auto w-full object-cover" />
      <p className="text-center pb-2 text-xs sm:text-base">{name}</p>
    </div>
  </Link>
);

const CategorySlider = () => {
  return (
    <div className="my-10 pl-4 sm:container ">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={6}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        grabCursor
        breakpoints={{
          320: { slidesPerView: 3.7, spaceBetween: 0 }, // Mobile
          640: { slidesPerView: 3, spaceBetween: 12 }, // Tablet
          1024: { slidesPerView: 5, spaceBetween: 12 }, // Medium screens
          1280: { slidesPerView: 6, spaceBetween: 12 }, // Large screens
        }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id} className="p-2">
            <CategoryCard {...category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategorySlider;
