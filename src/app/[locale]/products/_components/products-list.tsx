"use client";

import ProductCard from "@/components/new-products/product-cart";
import useProducts from "@/hooks/products/useProducts";
import React, { useMemo } from "react";

import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import ProductsBreadcrumb from "./products-breadcrumb";
import ProductSorting from "./products-sorting";
import ProductsPagination from "./products-pagination";

type UrlParams = {
  [key: string]: string | number | null | undefined;
};

const ProductsList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page") || 1);
  const sortBy = searchParams.get("sort") || "";

  // console.log(window.location.pathname);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [sortBy, setSortBy] = useState("");

  const updateUrlParams = (params: UrlParams) => {
    const urlSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlSearchParams.set(key, String(value));
      } else {
        urlSearchParams.delete(key);
      }
    });

    // const newUrl = `products?${urlSearchParams.toString()}`;
    router.push(`?${urlSearchParams.toString()}`, { scroll: false });

    // // Get query string
    // const queryString = urlSearchParams.toString();
    // const query = queryString ? `?${queryString}` : "";

    // // Use router.replace instead of constructing URL manually
    // // This avoids locale duplication issues
    // router.push(query, { scroll: false });
  };

  const queryParams = useMemo(
    () => ({
      "pagination[page]": `${currentPage}`,
      "pagination[pageSize]": "10",
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

  return (
    <div className="container">
      <ProductsBreadcrumb />

      <ProductSorting sortBy={sortBy} onSortChange={handleSortChange} />

      <div className="grid grid-cols-2 my-4 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} hasCartButton />
        ))}
      </div>

      {totalPages > 1 ? (
        <ProductsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : null}
    </div>
  );
};

export default ProductsList;
