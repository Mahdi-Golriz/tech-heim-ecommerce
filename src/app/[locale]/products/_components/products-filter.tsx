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
import { useState } from "react";

interface ProductsFilterProps {
  isVisible: boolean;
  onClose: () => void;
}

const ProductsFilter = ({ isVisible, onClose }: ProductsFilterProps) => {
  const { categories } = useCategories({});
  const minLimitPrice = 0;
  const maxLimitPrice = 2000;

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minLimitPrice,
    maxLimitPrice,
  ]);
  const [minPrice, setMinPrice] = useState<number>(priceRange[0]);
  const [maxPrice, setMaxPrice] = useState<number>(priceRange[1]);

  const handleSliderChange = (values: [number, number]) => {
    const newMin = values[0];
    const newMax = values[1];

    setPriceRange([newMin, newMax]);
    setMinPrice(newMin);
    setMaxPrice(newMax);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const newMinPrice =
      inputValue === ""
        ? minLimitPrice
        : Math.max(minLimitPrice, Math.min(parseInt(inputValue), maxPrice));

    setMinPrice(newMinPrice);
    setPriceRange((prev) => [newMinPrice, prev[1]]);
  };
  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const newMaxPrice =
      inputValue === ""
        ? maxLimitPrice
        : Math.min(maxLimitPrice, Math.max(parseInt(inputValue), minPrice));

    setMaxPrice(newMaxPrice);
    setPriceRange((prev) => [prev[0], newMaxPrice]);
  };

  const handleClearAll = () => {
    // Reset all values to defaults
    setPriceRange([minLimitPrice, maxLimitPrice]);
    setMinPrice(minLimitPrice);
    setMaxPrice(maxLimitPrice);
    // Add other filter clearing logic here
  };

  return (
    <div
      className={cn(
        "fixed w-full inset-0 -left-full sm:left-0 sm:relative bg-white z-50 px-6 sm:px-0 overflow-y-auto transition-all",
        isVisible ? "left-0" : ""
      )}
      aria-expanded="true"
    >
      <div className="flex items-center justify-between p-4">
        <h3 className="text-xl font-medium">Filters</h3>
        <Button
          variant="outline"
          className="p-0 border-none h-fit"
          onClick={handleClearAll}
        >
          Clear all
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              {categories.map((category) => (
                <div key={category.id} className="flex gap-4">
                  <Checkbox id={category.title} />
                  <label htmlFor={category.title}>{category.title}</label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex items-center justify-between border-b p-4">
        <label htmlFor="discount">Discount</label>
        <Switch id="discount" />
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-2">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent className="pt-2 mb-5">
            <div className="flex mb-6 justify-center gap-5 px-5">
              <Input
                type="number"
                min={minLimitPrice}
                max={priceRange[1]}
                placeholder="min."
                className="border-gray-500 w-20 placeholder:text-center placeholder:text-lg text-center"
                value={minPrice}
                onChange={handleMinInputChange}
              />
              <Input
                type="number"
                min={priceRange[0]}
                max={maxLimitPrice}
                placeholder="max."
                className="border-gray-500 w-20 placeholder:text-center placeholder:text-lg text-center"
                value={maxPrice}
                onChange={handleMaxInputChange}
              />
            </div>
            <Slider
              step={1}
              defaultValue={priceRange}
              onValueChange={handleSliderChange}
              value={priceRange}
              max={maxLimitPrice}
              min={minLimitPrice}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button className="block my-5 mx-auto" onClick={onClose}>
        Apply Filters
      </Button>
    </div>
  );
};

export default ProductsFilter;
