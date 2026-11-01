import { ProductImage } from "@/models/product-model";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ProductImageSlider = ({
  productImages,
}: {
  productImages: ProductImage[];
}) => {
  return (
    <div className="p-2 ">
      <Swiper
        modules={[Pagination]}
        slidesPerView={1}
        pagination={{ clickable: true }}
      >
        {productImages?.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="relative flex items-center justify-center h-52 mb-9 lg:mb-20 m-4">
              <Image
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="absolute object-scale-down"
                src={image.url}
                alt={image.alt}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default ProductImageSlider;
