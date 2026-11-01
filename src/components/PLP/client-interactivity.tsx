"use client";

import { useState } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components";
import { PiSlidersHorizontalLight } from "react-icons/pi";
import ProductSorting from "./products-sorting";
import ProductsFilter from "./products-filter";
import ProductsPagination from "./products-pagination";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Category } from "@/models/category-model";
import {
  FilterValues,
  PRICE_RANGE,
  ProductSort,
} from "@/validations/products-search-params.schema";

interface ClientInteractivityProps {
  categories: Category[];
  initialFilters: FilterValues;
  sortBy?: ProductSort;
  currentPage: number;
  totalPages: number;
}

type UrlParams = Record<string, string | number | boolean | null>;

const ClientInteractivity = ({
  categories,
  initialFilters,
  sortBy,
  currentPage,
  totalPages,
}: ClientInteractivityProps) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("products.plp.filters");

  // The URL is the state: the server page re-renders with the new params
  const updateUrl = (params: UrlParams) => {
    const urlParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === false || value === "") urlParams.delete(key);
      else urlParams.set(key, String(value));
    });
    if (urlParams.get("page") === "1") urlParams.delete("page");
    const query = urlParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    updateUrl({
      page: null,
      categories: newFilters.categories.length
        ? newFilters.categories.join(",")
        : null,
      minPrice:
        newFilters.priceRange[0] > PRICE_RANGE.min ? newFilters.priceRange[0] : null,
      maxPrice:
        newFilters.priceRange[1] < PRICE_RANGE.max ? newFilters.priceRange[1] : null,
      onSale: newFilters.onSale,
    });
  };

  const handleSortChange = (field: string) => {
    updateUrl({ sort: field === "default" ? null : field, page: null });
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
          key={JSON.stringify(initialFilters)}
          categories={categories}
          isVisible={isFilterVisible}
          onClose={toggleFilter}
          initialFilters={initialFilters}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div className="flex justify-between col-span-2 lg:col-span-3 sm:h-fit sm:justify-end">
        <ProductSorting sortBy={sortBy ?? "default"} onSortChange={handleSortChange} />
        <Button
          variant="outline"
          className="border-none shadow-custom text-black sm:hidden"
          onClick={toggleFilter}
        >
          <PiSlidersHorizontalLight />
          <span>{t("title")}</span>
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
};

export default ClientInteractivity;
