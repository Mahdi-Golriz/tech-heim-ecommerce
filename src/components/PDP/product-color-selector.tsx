import { cn } from "@/lib/utils";
import Button from "../ui/button";
import { useTranslations } from "next-intl";

interface ProductColorSelectorProps {
  colors: string[];
  setSelectedColor: (color: string) => void;
  selectedColor: string;
}

const ProductColorSelector = ({
  colors,
  setSelectedColor,
  selectedColor,
}: ProductColorSelectorProps) => {
  const t = useTranslations("products.pdp");
  return (
    <div className="py-4 border-b">
      <h4>{t("selectColor")}</h4>
      <div className="flex gap-3 py-3">
        {colors.map((color) => (
          <Button
            variant="outline"
            className={cn(
              "text-gray-700 border-gray-200 px-2",
              color === selectedColor ? "border-primary" : ""
            )}
            key={color}
            onClick={() => setSelectedColor(color)}
          >
            <span
              className="size-5 rounded-full border"
              style={{ backgroundColor: color }}
            ></span>
            {color}
          </Button>
        ))}
      </div>
    </div>
  );
};
export default ProductColorSelector;
