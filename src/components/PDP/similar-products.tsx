import { Swiper, SwiperSlide } from "swiper/react";
import SectionHeader from "../section-header/section-header";
import { Autoplay, Navigation } from "swiper/modules";
import ProductCard from "../new-products/product-cart";
import useFetch from "@/hooks/useFetch";
import { DataResponse } from "@/models/response-model";
import { Category } from "@/models/categories-model";
import PageLoader from "../ui/page-loader";
import { useTranslations } from "next-intl";

interface SimilarProductsProps {
  categoryId: string;
  productId: string;
}

const SimilarProducts = ({ categoryId, productId }: SimilarProductsProps) => {
  const { data, isLoading } = useFetch<DataResponse<Category>>({
    path: `/api/categories/${categoryId}`,
    autoFetch: !!categoryId,
    params: { "populate[products][populate][0]": "product_images" },
  });

  const t = useTranslations("products.pdp");

  const similarProducts = data?.data.products?.filter(
    (item) => item.documentId !== productId
  );

  if (isLoading) return <PageLoader />;

  return (
    <>
      <SectionHeader title={t("similarProducts")} />
      <div className="container py-10">
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          navigation
          grabCursor
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 12 },
            640: { slidesPerView: 2, spaceBetween: 12 },
            1024: { slidesPerView: 4, spaceBetween: 10 },
            1280: { slidesPerView: 5, spaceBetween: 10 },
          }}
        >
          {similarProducts?.slice(0, 6).map((product) => (
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
