"use client";

import ProductCard from "@/components/new-products/product-cart";
import { useState } from "react";

import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Button, CustomBreadcrumb } from "@/components";
import ProductSorting from "./products-sorting";
import ProductsPagination from "./products-pagination";
import ProductsFilter from "./products-filter";
import { PiSlidersHorizontalLight } from "react-icons/pi";
import ActiveFiltersDisplay from "./active-filters-display";
import useFetch from "@/hooks/useFetch";
import { Product } from "@/models/product-model";
import useProductsSearchParams from "@/hooks/useProductsSearchParams";

type UrlParams = {
  [key: string]: string | number | null | undefined | boolean;
};

export interface FilterValues {
  categories: string[];
  priceRange: [number, number];
  hasDiscount: boolean;
}

const breadcrumbLinks = [
  { href: "/", title: "Home" },
  { href: "/products", title: "Products" },
];

const Products = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { page, sortBy, filters, queryParams } = useProductsSearchParams();

  const {
    data: products,
    totalPages,
    isLoading,
  } = useFetch<Product[]>({
    params: { populate: "*", ...queryParams },
    path: "/api/products",
  });

  const handleFilterChange = (newFilters: FilterValues) =>
    updateUrl({
      page: 1,
      categories: newFilters.categories.length
        ? newFilters.categories.join(",")
        : null,
      minPrice: newFilters.priceRange[0] > 0 ? newFilters.priceRange[0] : null,
      maxPrice:
        newFilters.priceRange[1] < 2000 ? newFilters.priceRange[1] : null,
      hasDiscount: newFilters.hasDiscount ? true : "",
    });

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
  };

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

  const handleSortChange = (field: string) => {
    if (field === "default") {
      updateUrl({ page: "", sort: "" });
    } else {
      updateUrl({ sort: field, page: 1 });
    }
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
        <CustomBreadcrumb links={breadcrumbLinks} />
        <div className="w-full min-h-10">
          {hasActiveFilters && <ActiveFiltersDisplay filters={filters} />}
        </div>

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

            {isLoading && (
              <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-blue-600" />
              </div>
            )}

            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products?.map((product) => (
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

export default Products;
