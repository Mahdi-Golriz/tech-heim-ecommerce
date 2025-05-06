"use client";

import { Button } from "@/components";
import useCartActions from "@/hooks/useCartActions";
import { Link } from "@/i18n/routing";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import {
  PiBasketLight,
  PiMinusCircleLight,
  PiPlusCircleLight,
  PiSealCheck,
  PiTrashSimpleLight,
  PiTruck,
} from "react-icons/pi";

const CartPage = () => {
  const { items } = useCartStore();
  const { handleChangeItemQuantity, actionLoading, refreshCartLoading } =
    useCartActions();

  const subtotalPrice = items.reduce(
    (total, item) => total + item.product.price,
    0
  );

  const discount = items.reduce(
    (total, item) =>
      total + (item.product.price * item.product!.discount_percentage!) / 100,
    0
  );

  const grandTotal = subtotalPrice - discount;
  return (
    <div className="container mb-10">
      <div className="flex flex-col justify-center items-center my-5">
        <div className="rounded-full border-2 border-primary p-2 size-fit">
          <PiBasketLight size={32} color="blue" />
        </div>
        <span className="text-primary">
          {items.length === 0 ? <p>Your Cart is Empty</p> : "Cart"}
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:gap-10">
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
                        ? process.env.NEXT_PUBLIC_API_URL +
                          item.product.product_images[0].url
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
                      Guaranteed
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <PiTruck size={20} />
                    <span className="text-xs font-medium text-gray-500">
                      Free Delivery
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
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="icon"
                          className="p-0"
                          onClick={() =>
                            handleChangeItemQuantity({
                              deleteItem: true,
                              color: item.color,
                              productId: item.product.documentId,
                              itemQuantity: item.quantity,
                              itemId: item.documentId,
                            })
                          }
                        >
                          <PiTrashSimpleLight color="red" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="icon"
                            className="p-0 h-fit"
                            onClick={() => {
                              handleChangeItemQuantity({
                                color: item.color,
                                productId: item.product.documentId,
                                deleteItem: item.quantity === 1,
                                itemQuantity: item.quantity,
                                changeRate: -1,
                                itemId: item.documentId,
                              });
                            }}
                          >
                            {actionLoading || refreshCartLoading ? (
                              <div className="size-6 relative flex justify-center items-center">
                                <div className="rounded-full border-2 border-t-gray-600 animate-spin size-full"></div>
                              </div>
                            ) : (
                              <PiMinusCircleLight />
                            )}
                          </Button>

                          <span>{item.quantity}</span>

                          <Button
                            variant="icon"
                            className="p-0 h-fit"
                            onClick={() =>
                              handleChangeItemQuantity({
                                color: item.color,
                                productId: item.product.documentId,
                                itemId: item.documentId,
                                itemQuantity: item.quantity,
                                changeRate: 1,
                              })
                            }
                          >
                            {actionLoading || refreshCartLoading ? (
                              <div className="size-6 relative flex justify-center items-center">
                                <div className="rounded-full border-2 border-t-gray-600 animate-spin size-full"></div>
                              </div>
                            ) : (
                              <PiPlusCircleLight />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="my-5 md:shadow-custom h-fit p-4 md:my-0 grow">
          <h3 className="hidden md:block mb-6 text-2xl font-medium">
            Payment Details
          </h3>
          <ul className="flex flex-col gap-3">
            <li className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotalPrice.toFixed(2)}</span>
            </li>
            <li className="flex justify-between border-b-2 pb-3 text-gray-600">
              <span>Discount</span>
              <span>${discount.toFixed(2)}</span>
            </li>
            <li className="flex justify-between font-medium">
              <span>Grand total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </li>
          </ul>
          <Button className="my-5 w-full" asChild>
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
