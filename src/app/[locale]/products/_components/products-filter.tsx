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
import useCategories from "@/hooks/categories/useCategories";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FilterValues } from "./products-list";
import useMediaQuery from "@/hooks/useMediaQuery";

interface ProductsFilterProps {
  isVisible: boolean;
  onClose: () => void;
  initialFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}

const PRICE_RANGE = { min: 0, max: 2000 };

const ProductsFilter = ({
  isVisible,
  onClose,
  initialFilters,
  onFilterChange,
}: ProductsFilterProps) => {
  const { categories } = useCategories({});
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [filters, setFilters] = useState(initialFilters);
  const [minPrice, setMinPrice] = useState(initialFilters.priceRange[0]);
  const [maxPrice, setMaxPrice] = useState(initialFilters.priceRange[1]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFilters(initialFilters);
    setMinPrice(initialFilters.priceRange[0]);
    setMaxPrice(initialFilters.priceRange[1]);
    setHasChanges(false);
  }, [initialFilters]);

  const updateFilters = (updates: Partial<FilterValues>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const applyFilters = () => {
    // if (!hasChanges) return;
    onFilterChange(filters);
    setHasChanges(false);
    if (isMobile) onClose();
  };

  useEffect(() => {
    if (!isMobile && hasChanges) {
      const timer = setTimeout(applyFilters, 500);
      return () => clearTimeout(timer);
    }
  }, [filters, isMobile, hasChanges]);

  const handlePriceRangeChange = (values: [number, number]) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
    updateFilters({ priceRange: values });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.value === ""
        ? PRICE_RANGE.min
        : Math.max(
            PRICE_RANGE.min,
            Math.min(parseInt(e.target.value), maxPrice)
          );
    setMinPrice(value);
    updateFilters({ priceRange: [value, maxPrice] });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.value === ""
        ? PRICE_RANGE.max
        : Math.min(
            PRICE_RANGE.max,
            Math.max(parseInt(e.target.value), minPrice)
          );
    setMaxPrice(value);
    updateFilters({ priceRange: [minPrice, value] });
  };

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    updateFilters({
      categories: checked
        ? [...filters.categories, categoryId]
        : filters.categories.filter((id) => id !== categoryId),
    });
    console.log(filters.categories);
  };

  const resetFilters = () => {
    const defaultFilters: FilterValues = {
      categories: [],
      priceRange: [PRICE_RANGE.min, PRICE_RANGE.max],
      hasDiscount: false,
    };
    setFilters(defaultFilters);
    setMinPrice(PRICE_RANGE.min);
    setMaxPrice(PRICE_RANGE.max);
    setHasChanges(true);
    if (!isMobile) onFilterChange(defaultFilters);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 w-full -left-full sm:left-0 sm:relative bg-white z-50 px-6 sm:px-0 overflow-y-auto transition-all",
        { "left-0": isVisible }
      )}
    >
      <div className="flex items-center justify-between p-4">
        <h3 className="text-xl font-medium">Filters</h3>
        <Button
          variant="outline"
          className="p-0 border-none h-fit"
          onClick={resetFilters}
        >
          Clear all
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              {categories.map((category) => (
                <div key={category.id} className="flex gap-4">
                  <Checkbox
                    id={category.title}
                    checked={filters.categories.includes(String(category.id))}
                    onCheckedChange={(checked) =>
                      handleCategoryToggle(
                        String(category.id),
                        checked === true
                      )
                    }
                  />
                  <label htmlFor={category.title}>{category.title}</label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex items-center justify-between border-b p-4">
        <label htmlFor="discount">Discount</label>
        <Switch
          id="discount"
          checked={filters.hasDiscount}
          onCheckedChange={(checked) => updateFilters({ hasDiscount: checked })}
        />
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent className="pt-2 mb-5">
            <div className="flex mb-6 justify-center gap-5 px-5">
              <Input
                type="number"
                min={PRICE_RANGE.min}
                max={maxPrice}
                placeholder="min"
                className="border-gray-500 w-20 text-center"
                value={minPrice}
                onChange={handleMinPriceChange}
              />
              <Input
                type="number"
                min={minPrice}
                max={PRICE_RANGE.max}
                placeholder="max"
                className="border-gray-500 w-20 text-center"
                value={maxPrice}
                onChange={handleMaxPriceChange}
              />
            </div>
            <Slider
              step={1}
              onValueChange={handlePriceRangeChange}
              value={filters.priceRange}
              max={PRICE_RANGE.max}
              min={PRICE_RANGE.min}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {isMobile && (
        <Button className="block my-5 mx-auto" onClick={applyFilters}>
          Apply Filters
        </Button>
      )}
    </div>
  );
};

export default ProductsFilter;
