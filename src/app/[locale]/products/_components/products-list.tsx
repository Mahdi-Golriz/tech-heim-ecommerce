"use client";

import ProductCard from "@/components/new-products/product-cart";
import useProducts from "@/hooks/products/useProducts";
import React, { useMemo, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");

  const queryParams = useMemo(
    () => ({
      "pagination[page]": `${currentPage}`,
      "pagination[pageSize]": "10",
      sort: `${sortBy}`,
    }),
    [currentPage, sortBy]
  );

  const { products, totalPages } = useProducts({
    params: queryParams,
  });

  console.log(totalPages, products);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (field: string) => {
    setSortBy(field);
    setCurrentPage(1);
  };

  const renderPaginationItems = () => {
    const items = [];

    items.push(
      <PaginationItem key="first">
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(1);
          }}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) continue; // Skip first and last page as they're added separately

      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add last page if not the same as first page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    console.log(items);
    return items;
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      {/* Sorting Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="price:asc">Price: ascending</SelectItem>
              <SelectItem value="price:desc">Price: descending </SelectItem>
              <SelectItem value="createdAt:desc">New Arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Products Grid with loading state */}
      <div className="grid grid-cols-2 my-4 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} hasCartButton />
        ))}
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          {/* Previous button */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1);
                }
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {/* Pagination numbers */}
          {renderPaginationItems()}

          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  handlePageChange(currentPage + 1);
                }
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProductsList;
