import { useTranslations } from "next-intl";
import { Category } from "@/models/category-model";
import {
  FilterValues,
  PRICE_RANGE,
} from "@/validations/products-search-params.schema";

interface ActiveFiltersDisplayProps {
  filters: FilterValues;
  categories: Category[];
  query?: string;
}

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2 py-2 text-xs bg-gray-100 rounded-full">{children}</span>
);

const ActiveFiltersDisplay = ({ filters, categories, query }: ActiveFiltersDisplayProps) => {
  const t = useTranslations("products.plp.activeFilters");
  const selectedTitles = categories
    .filter((category) => filters.categories.includes(category.slug))
    .map((category) => category.title);

  return (
    <div className="flex flex-wrap items-center gap-2 my-3">
      <span className="text-sm text-gray-500">{t("title")}</span>
      {query && <Chip>{t("search", { query })}</Chip>}
      {selectedTitles.length > 0 && (
        <Chip>{t("categories", { list: selectedTitles.join(", ") })}</Chip>
      )}
      {(filters.priceRange[0] > PRICE_RANGE.min ||
        filters.priceRange[1] < PRICE_RANGE.max) && (
        <Chip>
          {t("price", { min: filters.priceRange[0], max: filters.priceRange[1] })}
        </Chip>
      )}
      {filters.onSale && <Chip>{t("onSale")}</Chip>}
    </div>
  );
};

export default ActiveFiltersDisplay;
