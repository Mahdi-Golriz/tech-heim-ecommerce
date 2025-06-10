"use client";

import Image from "next/image";
import cameraImage from "@/assets/hero/camera.jpg";
import phoneImage from "@/assets/hero/phone.jpg";
import gamingImage from "@/assets/hero/gaming.jpg";
import accessoriesImage from "@/assets/hero/accessory.jpg";
import laptopsImage from "@/assets/hero/laptop.jpg";
import wearableImage from "@/assets/hero/watch.jpg";
import { Button } from "@/components";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

const Hero = () => {
  const t = useTranslations("home.hero");
  const slides = [
    {
      image: cameraImage,
      text: t("slides.cameraText"),
      href: "/products?page=1&categories=4",
    },
    {
      image: accessoriesImage,
      text: t("slides.accessoriesText"),
      href: "/products?page=1&categories=6",
    },
    {
      image: wearableImage,
      text: t("slides.wearableText"),
      href: "/products?page=1&categories=3",
    },
    {
      image: gamingImage,
      text: t("slides.gamingText"),
      href: "/products?page=1&categories=5",
    },
    {
      image: laptopsImage,
      text: t("slides.laptopsText"),
      href: "/products?page=1&categories=2",
    },
    {
      image: phoneImage,
      text: t("slides.phoneText"),
      href: "/products?page=1&categories=1",
    },
  ];

  return (
    <section className="container my-10">
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet custom-bullet",
          bulletActiveClass:
            "swiper-pagination-bullet-active custom-bullet-active",
        }}
        className="rounded-lg"
        loop
        grabCursor
      >
        {slides.map((item) => (
          <SwiperSlide key={item.href}>
            <div className="relative sm:h-[600px] h-[400px]">
              <Image
                src={item.image}
                fill
                alt="tech heim"
                className="absolute object-cover object-center rounded-lg"
              />
              <div className="absolute lg:w-1/4 md:w-1/3 w-2/3 h-full flex flex-col items-start lg:items-center justify-between md:justify-start px-4 text-center gap-5 p-4">
                <p className="text-white font-medium md:text-lg text-sm">
                  {item.text}
                </p>
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="md:text-xl md:font-bold sm:h-12 text-sm px-2 sm:px-4"
                >
                  <Link href={item.href}>{t("cta")}</Link>
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
