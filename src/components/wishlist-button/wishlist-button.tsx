"use client";

import { useUserStore } from "@/store/user-store";
import Button from "../ui/button";
import { PiHeartLight, PiHeartFill } from "react-icons/pi";
import { cn } from "@/lib/utils";
import useWishlist from "@/hooks/useWishlist";

interface WishlistButtonProps {
  className?: string;
  relativePosition?: "topLeft" | "bottomRight";
  productId: string;
}

const WishlistButton = ({
  relativePosition,
  className,
  productId,
}: WishlistButtonProps) => {
  const user = useUserStore((state) => state.user);
  const { handleAddToWishList } = useWishlist();

  const filled = user?.wishlists?.some(
    (item) => item.product.documentId === productId
  );

  if (!user) return null;

  const handleClick = (e: React.MouseEvent) => {
    // Prevent both propagation and default behavior
    e.preventDefault();
    e.stopPropagation();

    handleAddToWishList({
      productId,
      userId: user.documentId,
      wishlist: user.wishlists,
    });
  };

  return (
    <Button
      variant="icon"
      onClick={handleClick}
      className={cn(
        "absolute p-0 [&_svg]:size-5 [&_svg]:text-blue-600",
        className,
        relativePosition === "bottomRight" ? "bottom-4 right-2" : "top-1"
      )}
    >
      {!!filled ? <PiHeartFill /> : <PiHeartLight />}
    </Button>
  );
};

export default WishlistButton;
