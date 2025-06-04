"use client";

import { PiBasketLight } from "react-icons/pi";
import Button from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown";

import { useCartStore } from "@/store/cart-store";
import { useState } from "react";

import ShoppingCartCard from "./shopping-cart-card";
import ShoppingCartFooter from "./shopping-cart-footer";
import { useTranslations } from "next-intl";

const ShoppingCartButton = () => {
  const items = useCartStore((state) => state.items);
  const [open, setOpen] = useState(false);
  const { totalItems } = useCartStore();
  const t = useTranslations("shoppingCart");

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
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
        sideOffset={30}
        align="end"
      >
        <div className="p-6">
          <h3 className="font-medium">
            {totalItems} {t("header")}
          </h3>
        </div>

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
                <ShoppingCartCard item={item} />
              </DropdownMenuItem>
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">{t("emptyState")}</p>
          )}
        </DropdownMenuGroup>
        {items.length > 0 && (
          <ShoppingCartFooter handleProceedToCart={() => setOpen(false)} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShoppingCartButton;
