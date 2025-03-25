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

type UrlParams = {
  [key: string]: string | number | null | undefined;
};

const ProductsList = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page") || 1);
  const sortBy = searchParams.get("sort") || "";

  const updateUrlParams = (params: UrlParams) => {
    const urlSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlSearchParams.set(key, String(value));
      } else {
        urlSearchParams.delete(key);
      }
    });

    router.push(`?${urlSearchParams.toString()}`, { scroll: false });
  };

  const queryParams = useMemo(
    () => ({
      "pagination[page]": `${currentPage}`,
      "pagination[pageSize]": "12",
      ...(sortBy ? { sort: sortBy } : {}),
    }),
    [currentPage, sortBy]
  );

  const { products, totalPages } = useProducts({
    params: queryParams,
  });

  const handlePageChange = (page: number) => {
    updateUrlParams({ page });
  };

  const handleSortChange = (field: string) => {
    updateUrlParams({ sort: field, page: 1 });
  };

  const handleOpenFilter = () => {
    setIsFilterVisible(true);
    document.body.classList.add("overflow-hidden");
  };

  const handleCloseFilter = () => {
    setIsFilterVisible(false);
    document.body.classList.remove("overflow-hidden");
  };

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
            onClose={handleCloseFilter}
          />
          <div className="lg:col-span-3 col-span-2 ">
            <div className="flex justify-between">
              <ProductSorting sortBy={sortBy} onSortChange={handleSortChange} />
              <Button
                variant="outline"
                className="border-none shadow-custom text-black sm:hidden"
                onClick={handleOpenFilter}
              >
                <PiSlidersHorizontalLight />
                <span>Filters</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} hasCartButton />
              ))}
            </div>
          </div>
        </div>

        {totalPages > 1 ? (
          <ProductsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        ) : null}
      </div>
    </>
  );
};

export default ProductsList;
