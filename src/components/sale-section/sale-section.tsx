"use client";

import Button from "../ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Autoplay, Navigation } from "swiper/modules";
import image from "@/assets/category-images/laptops.png";
import { useRef } from "react";

import SaleCard, { SaleCardProps } from "./sale-card";
import { NextButton, PrevButton } from "./sale-section-buttons";
import { useTranslations } from "next-intl";
import randomShape from "@/assets/sale-section/random-shape.png";
import Image from "next/image";

const saleItems: SaleCardProps[] = [
  {
    id: 1,
    title: "Logitech G502 Gaming Mouse",
    image: image,
    discount: 50,
    totalPrice: 38.0,
    salePrice: 19,
  },
];

const SaleSection = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const t = useTranslations("home.saleSection");

  return (
    <div className="container my-10">
      <div className="relative grid grid-cols-3 lg:grid-cols-5 py-4 w-full pl-2 lg:pt-11 lg:pb-0 bg-primary-500 rounded-lg overflow-hidden">
        <div className="flex flex-col justify-between items-center text-center min-w-32 text-white">
          <Image
            src={randomShape}
            width={270}
            height={235}
            alt="shape"
            className="absolute opacity-15 rotate-[100deg] lg:h-[500px] lg:w-[435px] lg:-top-40 lg:-left-40 -top-20 -left-20"
          />
          <div>
            <h3 className="text-sm lg:text-2xl font-medium">{t("title")}</h3>
            <h5 className="text-xs lg:text-xl font-light mt-2">{t("text")}</h5>
          </div>
          <Button variant="link" className="text-white lg:text-base" size="sm">
            {t("cta")}
          </Button>
        </div>
        <div className="col-span-2 lg:col-span-4 ml-7">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="relative"
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            navigation
            grabCursor
            breakpoints={{
              320: { slidesPerView: 1.5, spaceBetween: 16 },
              640: { slidesPerView: 2.5, spaceBetween: 16 },
              1024: { slidesPerView: 3.5, spaceBetween: 24 },
              1280: { slidesPerView: 4.5, spaceBetween: 24 },
            }}
          >
            {Array.from({ length: 7 }, (_, i) =>
              saleItems.map((elem) => ({ ...elem, id: i }))
            )
              .flat()
              .map((item) => (
                <SwiperSlide key={item.id} className=" bg-white rounded">
                  <SaleCard {...item} />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <div className="hidden lg:flex lg:justify-end col-start-5 lg:gap-1 p-2">
          <NextButton swiperRef={swiperRef} />
          <PrevButton swiperRef={swiperRef} />
        </div>
      </div>
    </div>
  );
};

export default SaleSection;
