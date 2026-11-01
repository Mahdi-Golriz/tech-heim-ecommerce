"use client";

import { Button, Checkbox, Input } from "@/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";
import { useEffect, useRef, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Category } from "@/models/category-model";
import { useTranslations } from "next-intl";
import {
  FilterValues,
  PRICE_RANGE,
} from "@/validations/products-search-params.schema";

interface ProductsFilterProps {
  categories: Category[];
  isVisible: boolean;
  onClose: () => void;
  initialFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}

const DEFAULT_FILTERS: FilterValues = {
  categories: [],
  priceRange: [PRICE_RANGE.min, PRICE_RANGE.max],
  onSale: false,
};

const DEBOUNCE_MS = 500;

/**
 * Local draft of the filters. Desktop applies changes automatically (debounced);
 * mobile applies them with the button. The parent passes a `key` derived from
 * the URL, so this component remounts with fresh state after navigation.
 */
const ProductsFilter = ({
  categories,
  isVisible,
  onClose,
  initialFilters,
  onFilterChange,
}: ProductsFilterProps) => {
  const t = useTranslations("products.plp.filters");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [filters, setFilters] = useState(initialFilters);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const isOpenPriceRange =
    initialFilters.priceRange[0] !== PRICE_RANGE.min ||
    initialFilters.priceRange[1] !== PRICE_RANGE.max;
  const isOpenCategories = initialFilters.categories.length !== 0;

  const apply = (next: FilterValues) => {
    clearTimeout(debounceRef.current);
    onFilterChange(next);
    if (isMobile) onClose();
  };

  const updateFilters = (updates: Partial<FilterValues>) => {
    const next = { ...filters, ...updates };
    setFilters(next);
    if (!isMobile) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onFilterChange(next), DEBOUNCE_MS);
    }
  };

  const clampPrice = (raw: string, fallback: number, min: number, max: number) =>
    raw === "" ? fallback : Math.max(min, Math.min(parseInt(raw, 10) || 0, max));

  const [minPrice, maxPrice] = filters.priceRange;

  const handleCategoryToggle = (slug: string, checked: boolean) => {
    updateFilters({
      categories: checked
        ? [...filters.categories, slug]
        : filters.categories.filter((s) => s !== slug),
    });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    if (!isMobile) apply(DEFAULT_FILTERS);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 w-full -left-full sm:left-0 sm:relative bg-white z-40 px-6 sm:px-0 overflow-y-auto transition-all",
        { "left-0": isVisible }
      )}
    >
      <div className="flex items-center justify-between p-4">
        <h3 className="text-xl font-medium">{t("title")}</h3>
        <Button
          variant="outline"
          className="p-0 border-none h-fit"
          onClick={resetFilters}
        >
          {t("secondCta")}
        </Button>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={isOpenCategories ? "categories" : ""}
      >
        <AccordionItem value="categories">
          <AccordionTrigger>{t("category")}</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              {categories.map((category) => (
                <div key={category.id} className="flex gap-4">
                  <Checkbox
                    id={`category-${category.slug}`}
                    checked={filters.categories.includes(category.slug)}
                    onCheckedChange={(checked) =>
                      handleCategoryToggle(category.slug, checked === true)
                    }
                  />
                  <label htmlFor={`category-${category.slug}`}>
                    {category.title}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex items-center justify-between border-b p-4">
        <label htmlFor="discount">{t("discount")}</label>
        <Switch
          id="discount"
          checked={filters.onSale}
          onCheckedChange={(checked) => updateFilters({ onSale: checked })}
        />
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={isOpenPriceRange ? "price" : ""}
      >
        <AccordionItem value="price">
          <AccordionTrigger>{t("price")}</AccordionTrigger>
          <AccordionContent className="pt-2 mb-5">
            <div className="flex mb-6 justify-center gap-5 px-5">
              <Input
                type="number"
                min={PRICE_RANGE.min}
                max={maxPrice}
                placeholder="min"
                className="border-gray-500 w-20 text-center"
                value={minPrice}
                onChange={(e) =>
                  updateFilters({
                    priceRange: [
                      clampPrice(e.target.value, PRICE_RANGE.min, PRICE_RANGE.min, maxPrice),
                      maxPrice,
                    ],
                  })
                }
              />
              <Input
                type="number"
                min={minPrice}
                max={PRICE_RANGE.max}
                placeholder="max"
                className="border-gray-500 w-20 text-center"
                value={maxPrice}
                onChange={(e) =>
                  updateFilters({
                    priceRange: [
                      minPrice,
                      clampPrice(e.target.value, PRICE_RANGE.max, minPrice, PRICE_RANGE.max),
                    ],
                  })
                }
              />
            </div>
            <Slider
              step={1}
              onValueChange={(values) =>
                updateFilters({ priceRange: [values[0], values[1]] })
              }
              value={filters.priceRange}
              max={PRICE_RANGE.max}
              min={PRICE_RANGE.min}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="block my-5 mx-auto sm:hidden" onClick={() => apply(filters)}>
        {t("firstCta")}
      </Button>
    </div>
  );
};

export default ProductsFilter;
