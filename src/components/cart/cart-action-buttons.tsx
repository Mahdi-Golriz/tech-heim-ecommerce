import useCartActions from "@/hooks/useCartActions";
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

const CartActionButtons = ({ item }: ActionButtonsProps) => {
  const { handleChangeItemQuantity, actionLoading, refreshCartLoading } =
    useCartActions();
  return (
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
            disabled={item.quantity === 1}
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
  );
};

export default CartActionButtons;
