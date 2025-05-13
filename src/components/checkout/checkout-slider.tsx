import { Swiper, SwiperSlide } from "swiper/react";
import CheckoutCart from "./checkout-cart";
import { useCartStore } from "@/store/cart-store";

const CheckoutSlider = () => {
  const items = useCartStore((state) => state.items);
  return (
    <div className="md:hidden">
      <Swiper
        grabCursor
        breakpoints={{
          320: { slidesPerView: 3.5, spaceBetween: 0 },
          640: { slidesPerView: 4, spaceBetween: 0 },
          768: { slidesPerView: 5, spaceBetween: 0 },
        }}
        className="bg-gray-100 rounded-lg "
      >
        {items.map((item) => (
          <SwiperSlide key={item.createdAt} className="py-3 pl-3">
            <CheckoutCart
              color={item.color}
              quantity={item.quantity}
              src={
                item.product.product_images
                  ? item.product.product_images[0].url
                  : ""
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CheckoutSlider;
