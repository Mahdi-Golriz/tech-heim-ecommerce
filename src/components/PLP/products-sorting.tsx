import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

type ProductSortingProps = {
  sortBy: string;
  onSortChange: (field: string) => void;
};

const ProductsSorting = ({ sortBy, onSortChange }: ProductSortingProps) => {
  const t = useTranslations("products.plp.sort");
  return (
    <div className="mb-3">
      <div>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] border-none shadow-custom">
            <SelectValue placeholder={t("defaultSort")} />
          </SelectTrigger>

          <SelectContent className="bg-white">
            <SelectItem value="default">{t("defaultSort")}</SelectItem>
            <SelectItem value="price:asc">{t("priceAsc")}</SelectItem>
            <SelectItem value="price:desc">{t("priceDesc")}</SelectItem>
            <SelectItem value="createdAt:desc">{t("newArrivals")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductsSorting;
