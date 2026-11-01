import { CartItem } from "@/models/cart-model";
import { cn } from "@/lib/cn";

interface CartLinePriceProps {
  item: CartItem;
  className?: string;
  originalClassName?: string;
}

/** Line total, with the pre-discount total struck through when discounted. */
const CartLinePrice = ({ item, className, originalClassName }: CartLinePriceProps) => {
  const { price, finalPrice, discountPercentage } = item.product;
  const total = (finalPrice * item.quantity).toFixed(2);

  if (!discountPercentage) return <span className={className}>$ {total}</span>;

  return (
    <>
      <span className={cn("line-through", originalClassName)}>
        $ {(price * item.quantity).toFixed(2)}
      </span>
      <span className={className}>$ {total}</span>
    </>
  );
};

export default CartLinePrice;
