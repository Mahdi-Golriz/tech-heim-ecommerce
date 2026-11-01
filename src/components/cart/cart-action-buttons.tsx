"use client";

import useCart from "@/hooks/useCart";
import Button from "../ui/button";
import {
  PiMinusCircleLight,
  PiPlusCircleLight,
  PiTrashSimpleLight,
} from "react-icons/pi";
import { CartItem } from "@/models/cart-model";

interface ActionButtonsProps {
  item: CartItem;
}

const Spinner = () => (
  <div className="size-6 relative flex justify-center items-center">
    <div className="rounded-full border-2 border-t-gray-600 animate-spin size-full"></div>
  </div>
);

const CartActionButtons = ({ item }: ActionButtonsProps) => {
  const { setQuantity, removeItem, isPending } = useCart();

  return (
    <div className="mt-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button
          variant="icon"
          className="p-0"
          aria-label="Remove"
          disabled={isPending}
          onClick={() => removeItem(item)}
        >
          <PiTrashSimpleLight color="red" />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="icon"
            className="p-0 h-fit"
            aria-label="Decrease quantity"
            disabled={item.quantity === 1 || isPending}
            onClick={() => setQuantity(item, item.quantity - 1)}
          >
            {isPending ? <Spinner /> : <PiMinusCircleLight />}
          </Button>

          <span>{item.quantity}</span>

          <Button
            variant="icon"
            className="p-0 h-fit"
            aria-label="Increase quantity"
            disabled={isPending}
            onClick={() => setQuantity(item, item.quantity + 1)}
          >
            {isPending ? <Spinner /> : <PiPlusCircleLight />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartActionButtons;
