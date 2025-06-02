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
  const slides = [
    {
      image: cameraImage,
      text: "Capture life's perfect moments with professional-grade cameras and imaging gear.",
      href: "/products?page=1&categories=7",
    },
    {
      image: accessoriesImage,
      text: "Complete your tech setup with premium accessories that enhance every experience.",
      href: "/products?page=1&categories=10",
    },
    {
      image: wearableImage,
      text: "Stay connected and track your goals with smart wearables designed for modern life.",
      href: "/products?page=1&categories=5",
    },
    {
      image: gamingImage,
      text: "Level up your gameplay with high-performance gaming gear and accessories.",
      href: "/products?page=1&categories=8",
    },
    {
      image: laptopsImage,
      text: "Power through any task with cutting-edge laptops and desktop solutions.",
      href: "/products?page=1&categories=3",
    },
    {
      image: phoneImage,
      text: "Discover the latest smartphones that keep you connected to what matters most.",
      href: "/products?page=1&categories=2",
    },
  ];

  const t = useTranslations("home.hero");
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
