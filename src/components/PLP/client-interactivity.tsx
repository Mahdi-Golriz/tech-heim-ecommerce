"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components";
import { PiSlidersHorizontalLight } from "react-icons/pi";
import ProductSorting from "./products-sorting";
import ProductsFilter from "./products-filter";
import ProductsPagination from "./products-pagination";
import { FilterValues } from ".";

interface ClientInteractivityProps {
  initialFilters: FilterValues;
  sortBy: string;
  currentPage: number;
  totalPages: number;
}

type UrlParams = {
  [key: string]: string | number | null | undefined | boolean;
};

export default function ClientInteractivity({
  initialFilters,
  sortBy,
  currentPage,
  totalPages,
}: ClientInteractivityProps) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const router = useRouter();

  const updateUrl = (params: UrlParams) => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        urlParams.set(key, String(value));
      }
    });
    router.push(`/products?${urlParams.toString()}`, { scroll: false });
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    updateUrl({
      page: 1,
      categories: newFilters.categories.length
        ? newFilters.categories.join(",")
        : null,
      minPrice: newFilters.priceRange[0] > 0 ? newFilters.priceRange[0] : null,
      maxPrice:
        newFilters.priceRange[1] < 2000 ? newFilters.priceRange[1] : null,
      hasDiscount: newFilters.hasDiscount ? true : null,
    });
  };

  const handleSortChange = (field: string) => {
    updateUrl({ sort: field === "default" ? "" : field, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
  };

  const toggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
    document.body.classList.toggle("overflow-hidden");
  };

  return (
    <>
      <div className="sm:row-span-2">
        <ProductsFilter
          isVisible={isFilterVisible}
          onClose={toggleFilter}
          initialFilters={initialFilters}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div className="flex justify-between col-span-2 lg:col-span-3 sm:h-fit sm:justify-end">
        <ProductSorting sortBy={sortBy} onSortChange={handleSortChange} />
        <Button
          variant="outline"
          className="border-none shadow-custom text-black sm:hidden"
          onClick={toggleFilter}
        >
          <PiSlidersHorizontalLight />
          <span>Filters</span>
        </Button>
      </div>
      <div className="order-last col-span-full">
        {totalPages > 1 && (
          <ProductsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}
