"use client";

import Image from "next/image";
import { PiSealCheck, PiTruck } from "react-icons/pi";
import { useCartStore } from "@/store/cart-store";
import ActionButtons from "./cart-action-buttons";
import { useTranslations } from "next-intl";
import { getImageUrl } from "@/utils/getImageUrl";

const CartList = () => {
  const items = useCartStore((state) => state.items);
  const t = useTranslations("cart.cartCard");

  return (
    <div className="md:w-2/3">
      {items.map((item) => (
        <div
          className="shadow-custom rounded-lg p-2 cursor-default mb-3 bg-white"
          key={item.createdAt}
        >
          <div className="flex w-full">
            <div className="relative w-44 h-auto">
              <Image
                src={
                  item.product.product_images
                    ? getImageUrl(item.product.product_images[0].url)
                    : ""
                }
                alt=""
                fill
                className="absolute object-scale-down p-2"
              />
            </div>
            <div className="px-3 w-2/3 flex flex-col gap-2">
              <h3 className="text-base font-medium line-clamp-2 my-4">
                {item.product.title}
              </h3>
              <div className="flex gap-2 items-center">
                <div
                  className="size-5 rounded-full border"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-xs text-gray-500 font-medium">
                  {item.color}
                </p>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <PiSealCheck size={20} />
                <span className="text-xs font-medium text-gray-500">
                  {t("guarantee")}
                </span>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <PiTruck size={20} />
                <span className="text-xs font-medium text-gray-500">
                  {t("delivery")}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="flex gap-3 items-center">
                  {item.product.discount_percentage ? (
                    <>
                      <p className="text-xs lg:text-sm line-through font-normal text-gray-600">
                        $ {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-base lg:text-lg">
                        ${" "}
                        {(
                          (item.product.price -
                            (item.product.discount_percentage / 100) *
                              item.product.price) *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <span className="text-xs lg:text-lg">
                      $ {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  )}
                </div>
                <ActionButtons item={item} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartList;
