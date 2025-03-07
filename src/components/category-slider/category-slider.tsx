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
import { useTranslations } from "next-intl";
import { useMemo } from "react";

type Category = {
  id: number;
  name: string;
  image: StaticImageData;
};

const CategoryCard = ({ image, name }: Category) => (
  <Link
    href="/"
    className="block h-28 sm:h-36 lg:h-48 p-2 shadow-cart rounded-lg"
  >
    <Image
      src={image}
      alt={name}
      className="mx-auto h-3/4 object-scale-down object-center"
    />
    <p className="text-center text-xs my-2 sm:text-base whitespace-nowrap">
      {name}
    </p>
  </Link>
);

const CategorySlider = () => {
  const t = useTranslations("home.categorySlider.categories");

  const categories = useMemo(
    () => [
      { id: 1, name: t("accessories"), image: accessory },
      { id: 2, name: t("wearables"), image: smartWatch },
      { id: 3, name: t("gaming"), image: game },
      { id: 4, name: t("smartPhone"), image: mobile },
      { id: 5, name: t("laptops"), image: laptops },
      { id: 6, name: t("cameras"), image: cameras },
    ],
    [t]
  );

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
