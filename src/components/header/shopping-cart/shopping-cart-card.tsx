import Image from "next/image";
import { CartItem } from "@/models/cart-model";
import CartLinePrice from "@/components/cart/cart-line-price";
import CartActionButtons from "@/components/cart/cart-action-buttons";

interface ShoppingCartCardProps {
  item: CartItem;
}

const ShoppingCartCard = ({ item }: ShoppingCartCardProps) => (
  <div className="flex w-full">
    <div className="relative w-44 h-36">
      <Image
        src={item.product.image?.url ?? "/placeholder.svg"}
        alt={item.product.title}
        fill
        sizes="176px"
        className="absolute object-scale-down p-2"
      />
    </div>
    <div className="px-3 w-2/3 flex flex-col gap-1 ">
      <h3 className="text-base font-medium line-clamp-2">{item.product.title}</h3>
      <p className="text-xs text-gray-500">{item.color}</p>
      <p className="text-xs text-gray-500">x {item.quantity}</p>
      <div className="mt-auto flex justify-between items-center">
        <p className="text-xs text-gray-500 flex gap-2">
          <CartLinePrice item={item} className="font-bold" />
        </p>
        <CartActionButtons item={item} />
      </div>
    </div>
  </div>
);

export default ShoppingCartCard;
