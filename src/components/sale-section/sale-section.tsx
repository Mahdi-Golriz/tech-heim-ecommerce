"use client";

import Button from "../ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Autoplay, Navigation } from "swiper/modules";
import image from "@/assets/category-images/laptops.png";
import Image, { StaticImageData } from "next/image";
import React, { FC, useRef } from "react";
import SwiperInstance from "swiper";
import { PiCaretRight } from "react-icons/pi";
import { PiCaretLeft } from "react-icons/pi";

interface SaleCardProps {
  id: number;
  title: string;
  image: StaticImageData;
  discount: number;
  totalPrice: number;
  salePrice: number;
}

interface SwiperButtonProps {
  swiperRef: React.RefObject<SwiperInstance | null>;
}

const saleItems: SaleCardProps[] = [
  {
    id: 1,
    title: "Logitech G502 Gaming Mouse",
    image: image,
    discount: 50,
    totalPrice: 38.0,
    salePrice: 19,
  },
  {
    id: 2,
    title: "Logitech G502 Gaming Mouse",
    image: image,
    discount: 50,
    totalPrice: 38,
    salePrice: 19,
  },
  {
    id: 3,
    title: "Logitech G502 Gaming Mouse",
    image: image,
    discount: 50,
    totalPrice: 38,
    salePrice: 19,
  },
  {
    id: 4,
    title:
      "Logitech G502 Gaming Mouse Logitech G502 Gaming Mouse Logitech G502 Gaming Mouse",
    image: image,
    discount: 50,
    totalPrice: 38,
    salePrice: 19,
  },
  {
    id: 5,
    title: "Logitech G502 Gaming Mouse",
    image: image,
    discount: 50,
    totalPrice: 38,
    salePrice: 19,
  },
  {
    id: 6,
    title: "Logitech G502 Gaming Mouse",
    image: image,
    discount: 50,
    totalPrice: 38,
    salePrice: 19,
  },
  {
    id: 7,
    title: "Logitech G502 Gaming Mouse",
    image: image,
    discount: 50,
    totalPrice: 38,
    salePrice: 19,
  },
];

const SaleCard: FC<SaleCardProps> = ({
  title,
  image,
  discount,
  salePrice,
  totalPrice,
}) => (
  <div className="relative h-36 lg:h-60 flex flex-col p-2 justify-between rounded text-xs">
    <span className="absolute left-0 p-1 bg-secondary-100 text-secondary-400 text-xs rounded-r-lg">
      -{discount}%
    </span>
    <figure className="h-5/6">
      <Image
        src={image}
        alt={title}
        className="mx-auto h-4/5 object-scale-down object-center"
      />
      <figcaption className="truncate lg:line-clamp-2 lg:whitespace-normal">
        {title}
      </figcaption>
    </figure>

    {/* <p className="truncate lg:line-clamp-2 lg:whitespace-normal">{title}</p> */}
    <div className="flex justify-between">
      <span className="text-gray-500 line-through">${totalPrice}</span>
      <span>${salePrice}</span>
    </div>
  </div>
);

const SaleSection = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="container my-10">
      <div className="grid grid-cols-3 lg:grid-cols-5 py-4 w-full pl-2 lg:pt-11 lg:pb-0 bg-primary-500 rounded-lg">
        <div className="flex flex-col justify-between items-center text-center min-w-32 text-white">
          <div>
            <h3 className="text-sm lg:text-2xl font-medium">
              Products On Sale
            </h3>
            <h5 className="text-xs lg:text-xl font-light mt-2">Shop Now!</h5>
          </div>
          <Button variant="link" className="text-white lg:text-base" size="sm">
            View all
          </Button>
        </div>
        <div className="col-span-2 lg:col-span-4 ml-7">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="relative"
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            navigation={true}
            grabCursor
            breakpoints={{
              320: { slidesPerView: 1.5, spaceBetween: 16 },
              640: { slidesPerView: 2.5, spaceBetween: 16 },
              1024: { slidesPerView: 3.5, spaceBetween: 24 },
              1280: { slidesPerView: 4.5, spaceBetween: 24 },
            }}
          >
            {saleItems.map((item) => (
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

export const NextButton = ({ swiperRef }: SwiperButtonProps) => {
  return (
    <Button
      variant="icon"
      onClick={() => swiperRef.current?.slideNext()}
      className="p-0 rounded-full bg-white size-8 [&_svg]:size-4"
    >
      <PiCaretLeft color="darkBlue" strokeWidth={20} />
    </Button>
  );
};

export const PrevButton = ({ swiperRef }: SwiperButtonProps) => {
  return (
    <Button
      variant="icon"
      onClick={() => swiperRef.current?.slidePrev()}
      className="p-0 rounded-full bg-white size-8 [&_svg]:size-4"
    >
      <PiCaretRight color="darkBlue" strokeWidth={20} />
    </Button>
  );
};

export default SaleSection;
