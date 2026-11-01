import { Swiper, SwiperSlide } from "swiper/react";
import SectionHeader from "../section-header/section-header";
import { Autoplay, Navigation } from "swiper/modules";
import ProductCard from "../new-products/product-cart";
import { ProductSummary } from "@/models/product-model";
import { useTranslations } from "next-intl";

interface SimilarProductsProps {
  products: ProductSummary[];
}

const SimilarProducts = ({ products }: SimilarProductsProps) => {
  const t = useTranslations("products.pdp");

  return (
    <>
      <SectionHeader title={t("similarProducts")} />
      <div className="container py-10">
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={products.length > 4}
          navigation
          grabCursor
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 12 },
            640: { slidesPerView: 2, spaceBetween: 12 },
            1024: { slidesPerView: 4, spaceBetween: 10 },
            1280: { slidesPerView: 5, spaceBetween: 10 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="p-2">
              <ProductCard
                product={product}
                hasAddToCartButton
                wishlistButtonPosition="bottomRight"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default SimilarProducts;
