import { Product } from "@/models/product-model";
import Button from "../ui/button";
import useCart from "@/hooks/useCart";

interface AddToCartButtonProps {
  selectedColor: string;
  product: Product;
}

const AddToCartButton = ({ product, selectedColor }: AddToCartButtonProps) => {
  const { addToCart, isLoading } = useCart();

  return (
    <Button
      className="w-1/2 h-full lg:h-auto lg:w-full lg:order-2"
      onClick={() => addToCart({ product, color: selectedColor })}
    >
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
