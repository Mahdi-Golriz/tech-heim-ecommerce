"use client";

import { useCartStore } from "@/store/cart-store";
import { PiBasketLight } from "react-icons/pi";

const CartHeader = () => {
  const items = useCartStore((state) => state.items);
  return (
    <div className="flex flex-col justify-center items-center my-5">
      <div className="rounded-full border-2 border-primary p-2 size-fit">
        <PiBasketLight size={32} color="blue" />
      </div>
      <span className="text-primary">
        {items.length === 0 ? <p>Your Cart is Empty</p> : "Cart"}
      </span>
    </div>
  );
};

export default CartHeader;
