"use client";

import Button from "../ui/button";
import { PiHeartLight, PiHeartFill } from "react-icons/pi";
import { cn } from "@/lib/cn";
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
  // Guests see the button too; clicking it opens the sign-in modal
  const { isWishlisted, toggle, isPending } = useWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    // The button sits inside a product <Link>
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  return (
    <Button
      variant="icon"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isWishlisted}
      aria-label="Wishlist"
      className={cn(
        "absolute p-0 [&_svg]:size-5 [&_svg]:text-blue-600",
        className,
        relativePosition === "bottomRight" ? "bottom-4 right-2" : "top-1"
      )}
    >
      {isWishlisted ? <PiHeartFill /> : <PiHeartLight />}
    </Button>
  );
};

export default WishlistButton;
