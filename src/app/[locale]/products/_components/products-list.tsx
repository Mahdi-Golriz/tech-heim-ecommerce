"use client";

import ProductCard from "@/components/new-products/product-cart";
import useProducts from "@/hooks/products/useProducts";
import React, { useMemo, useState } from "react";

import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Button, CustomBreadcrumb } from "@/components";
import ProductSorting from "./products-sorting";
import ProductsPagination from "./products-pagination";
import ProductsFilter from "./products-filter";
import { PiSlidersHorizontalLight } from "react-icons/pi";
import ActiveFiltersDisplay from "./active-filters-display";

type UrlParams = {
  [key: string]: string | number | null | undefined | boolean;
};

export interface FilterValues {
  categories: string[];
  priceRange: [number, number];
  hasDiscount: boolean;
}

// const DEFAULT_FILTERS: FilterValues = {
//   categories: [],
//   priceRange: [0, 2000],
//   hasDiscount: false,
// };

const ProductsList = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse URL parameters
  const getUrlParams = (): {
    page: number;
    sortBy: string;
    filters: FilterValues;
  } => {
    const page = Number(searchParams.get("page") || 1);
    const sortBy = searchParams.get("sort") || "";
    const categories = searchParams.get("categories")?.split(",") || [];
    const minPrice = Number(searchParams.get("price[$gt]") || 0);
    const maxPrice = Number(searchParams.get("price[$lt]") || 2000);
    const hasDiscount =
      searchParams.get("discount_percentage[$notNull]") === "true";

    console.log(searchParams.get("categories")?.split(","));

    return {
      page,
      sortBy,
      filters: { categories, priceRange: [minPrice, maxPrice], hasDiscount },
    };
  };

  const { page, sortBy, filters } = getUrlParams();

  // Update URL parameters
  const updateUrl = (params: UrlParams) => {
    const urlParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlParams.set(key, String(value));
      } else {
        urlParams.delete(key);
      }
    });

    router.push(`?${urlParams.toString()}`, { scroll: false });
  };

  // API query parameters
  const queryParams = useMemo(() => {
    const params: { [key: string]: string } = {
      "pagination[page]": `${page}`,
      "pagination[pageSize]": "12",
      ...(sortBy && { sort: sortBy }),
      ...(filters.priceRange[0] > 0 && {
        "filters[price][$gt]": String(filters.priceRange[0]),
      }),
      ...(filters.priceRange[1] < 2000 && {
        "filters[price][$lt]": String(filters.priceRange[1]),
      }),
      ...(filters.hasDiscount && {
        "filters[discount_percentage][$notNull]": "null",
      }),
    };

    // Add each category as filters[categories][index]
    filters.categories.forEach((categoryId, index) => {
      params[`filters[categories][${index}]`] = categoryId;
    });

    return params;
  }, [page, sortBy, filters]);

  const { products, totalPages, isLoading } = useProducts({
    params: queryParams,
  });

  const handleFilterChange = (newFilters: FilterValues) =>
    updateUrl({
      page: 1,
      categories: newFilters.categories.length
        ? newFilters.categories.join(",")
        : null,
      "price[$gt]":
        newFilters.priceRange[0] > 0 ? newFilters.priceRange[0] : null,
      "price[$lt]":
        newFilters.priceRange[1] < 2000 ? newFilters.priceRange[1] : null,
      "discount_percentage[$notNull]": newFilters.hasDiscount ? "true" : "",
    });

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
  };

  const handleSortChange = (field: string) => {
    updateUrl({ sort: field, page: 1 });
  };

  const toggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
    document.body.classList.toggle("overflow-hidden");
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 2000 ||
    filters.hasDiscount;

  return (
    <>
      <div className="container">
        <CustomBreadcrumb
          links={[
            { href: "/", title: "Home" },
            { href: "/products", title: "Products" },
          ]}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 my-4 lg:grid-cols-4 lg:gap-6 gap-4">
          <ProductsFilter
            isVisible={isFilterVisible}
            onClose={toggleFilter}
            initialFilters={filters}
            onFilterChange={handleFilterChange}
          />
          <div className="lg:col-span-3 col-span-2 ">
            <div className="flex justify-between">
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

            {hasActiveFilters && <ActiveFiltersDisplay filters={filters} />}

            {isLoading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-blue-600" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} hasCartButton />
                ))}
              </div>
            ) : (
              <div className="col-span-full py-10 text-center text-gray-500">
                No products match your current filters.
              </div>
            )}
          </div>
        </div>

        {totalPages > 1 ? (
          <ProductsPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        ) : null}
      </div>
    </>
  );
};

export default ProductsList;
