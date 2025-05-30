"use client";

import ProductCard from "@/components/new-products/product-cart";
import { CustomBreadcrumb } from "@/components";
import ActiveFiltersDisplay from "./active-filters-display";
import { Product } from "@/models/product-model";
import { DataResponse } from "@/models/response-model";
import PageLoader from "../ui/page-loader";
import ClientInteractivity from "./client-interactivity";

export interface FilterValues {
  categories: string[];
  priceRange: [number, number];
  hasDiscount: boolean;
}

interface ProductsProps {
  products: DataResponse<Product[]> | null;
  page: number;
  sortBy: string;
  filters: FilterValues;
  totalPages: number;
}

const breadcrumbLinks = [
  { href: "/", title: "Home" },
  { href: "/products", title: "Products" },
];

const Products = ({
  products,
  page,
  sortBy,
  filters,
  totalPages,
}: ProductsProps) => {
  const hasActiveFilters = filters
    ? filters.categories.length > 0 ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 2000 ||
      filters.hasDiscount
    : false;

  return (
    <div className="container">
      <CustomBreadcrumb links={breadcrumbLinks} />
      <div className="w-full min-h-10">
        {hasActiveFilters && filters && (
          <ActiveFiltersDisplay filters={filters} />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 mb-4 lg:grid-cols-4 lg:gap-6 gap-4">
        <ClientInteractivity
          initialFilters={filters}
          sortBy={sortBy}
          currentPage={page}
          totalPages={totalPages}
        />
        <div className="lg:col-span-3 col-span-2 min-h-screen">
          {!products ? (
            <PageLoader fullPage />
          ) : products.data.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.data.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  hasAddToCartButton
                  wishlistButtonPosition="bottomRight"
                />
              ))}
            </div>
          ) : (
            <div className="col-span-full py-10 text-center text-gray-500">
              No products match your current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
