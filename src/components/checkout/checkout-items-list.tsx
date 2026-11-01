"use client";

import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import CartLinePrice from "../cart/cart-line-price";

const CheckoutItemsList = () => {
  const items = useCartStore((state) => state.items);
  return (
    <ul className="hidden md:block">
      {items.map((item) => (
        <li key={item.id} className="flex p-1 gap-1 border-b">
          <Image
            src={item.product.image?.url ?? "/placeholder.svg"}
            alt={item.product.title}
            width={87}
            height={74}
            className="object-scale-down object-center"
          />
          <div className="p-1 text-gray-600 grow">
            <h3 className="line-clamp-1 text-xs">{item.product.title}</h3>
            <p className="text-[10px] my-1">{item.color}</p>
            <p className="text-[10px]">x{item.quantity}</p>
            <p className="text-end flex justify-end gap-3 items-baseline">
              <CartLinePrice item={item} className="text-xs" originalClassName="text-[10px]" />
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CheckoutItemsList;
