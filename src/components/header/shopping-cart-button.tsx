"use client";

import {
  PiBasketLight,
  PiShoppingCartSimpleLight,
  PiTrashSimpleLight,
  PiMinusCircleLight,
  PiPlusCircleLight,
} from "react-icons/pi";
import Button from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { Link } from "@/i18n/routing";
import { useEffect, useState } from "react";
import useCartActions from "@/hooks/useCartActions";

const ShoppingCartButton = () => {
  const items = useCartStore((state) => state.items);
  const [sideOffset, setSideOffset] = useState(70);
  const { handleChangeItemQuantity } = useCartActions();

  // Calculate total items
  const totalItems = items.reduce(
    (totalNumber, item) => totalNumber + item.quantity,
    0
  );
  // Calculate total price
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  useEffect(() => {
    const updateSideOffset = () => {
      if (window.innerWidth > 640) {
        setSideOffset(30);
      } else {
        setSideOffset(70);
      }
    };

    updateSideOffset();
    window.addEventListener("resize", updateSideOffset);

    return () => {
      window.removeEventListener("resize", updateSideOffset);
    };
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Button variant="icon" size="icon">
            <PiBasketLight />
          </Button>
          <span className="absolute bg-red-600 rounded-full px-2 text-white -right-3 top-1 cursor-pointer text-xs">
            {totalItems}
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="rounded-t-none bg-gray-50 w-screen h-screen border-none sm:w-[600px] sm:h-fit sm:max-h-[650px]"
        sideOffset={sideOffset}
        align="end"
      >
        {/* Header - Cart Summary */}
        <div className="p-4">
          <h3 className="font-medium">{totalItems} items</h3>
        </div>
        {/* Items List */}
        <DropdownMenuGroup className="px-6 overflow-y-auto">
          {items.length > 0 ? (
            items.map((item) => (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
                key={item.createdAt}
                className="shadow-custom rounded-lg p-2 cursor-default mb-3 bg-white"
              >
                <div className="flex w-full">
                  <div className="relative w-44 h-36">
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
                  <div className="px-3 w-2/3 flex flex-col gap-1 ">
                    <h3 className="text-base font-medium line-clamp-2">
                      {item.product.title}
                    </h3>
                    <p className="text-xs text-gray-500">{item.color}</p>
                    <p className="text-xs text-gray-500">x {item.quantity}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        $ {(item.product.price * item.quantity).toFixed(2)}
                      </p>
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
                            onClick={() =>
                              handleChangeItemQuantity({
                                color: item.color,
                                productId: item.product.documentId,
                                itemQuantity: item.quantity,
                                changeRate: -1,
                                itemId: item.documentId,
                              })
                            }
                          >
                            <PiMinusCircleLight />
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
                            <PiPlusCircleLight />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">Your cart is empty</p>
          )}
        </DropdownMenuGroup>
        {items.length > 0 && (
          <>
            {/* Footer - Total and Checkout Button */}
            <div className="px-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col px-4 w-fit">
                  <span className="font-medium ">Grand total</span>
                  <span className="font-bold text-lg">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <Button className="w-2/3 py-2 text-base " asChild>
                  <Link href="/cart" passHref className="h-12">
                    Proceed to Cart
                    <PiShoppingCartSimpleLight />
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShoppingCartButton;
