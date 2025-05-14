import Button from "@/components/ui/button";
import useCartActions from "@/hooks/useCartActions";
import { CartItem } from "@/models/cart-model";
import Image from "next/image";
import {
  PiMinusCircleLight,
  PiPlusCircleLight,
  PiTrashSimpleLight,
} from "react-icons/pi";

interface ShoppingCartCardProps {
  item: CartItem;
}

const ShoppingCartCard = ({ item }: ShoppingCartCardProps) => {
  const { handleChangeItemQuantity } = useCartActions();
  return (
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
          {item.product.discount_percentage ? (
            <p className="text-xs text-gray-500">
              <s>$ {(item.product.price * item.quantity).toFixed(2)}</s>
              <b className="ml-2">
                {(
                  ((item.product.price * 100 -
                    item.product.discount_percentage) /
                    100) *
                  item.quantity
                ).toFixed(2)}
              </b>
            </p>
          ) : (
            <b className="text-xs text-gray-500">
              $ {(item.product.price * item.quantity).toFixed(2)}
            </b>
          )}

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
                className="p-0 h-fit border-transparent"
                disabled={item.quantity === 1}
                onClick={() => {
                  handleChangeItemQuantity({
                    color: item.color,
                    productId: item.product.documentId,
                    itemQuantity: item.quantity,
                    changeRate: -1,
                    itemId: item.documentId,
                  });
                }}
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
  );
};

export default ShoppingCartCard;
