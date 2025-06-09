import { ProductImage } from "@/models/product-model";
import { getImageUrl } from "@/utils/getImageUrl";
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
          <SwiperSlide key={image.documentId}>
            <div className="relative flex items-center justify-center h-52 mb-9 lg:mb-20 m-4">
              <Image
                fill
                className="absolute object-scale-down"
                src={getImageUrl(image.url)}
                alt={image.name}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default ProductImageSlider;
