import ProductCard from "@/components/new-products/product-cart";
import { CustomBreadcrumb } from "@/components";
import ActiveFiltersDisplay from "./active-filters-display";
import { Paginated, ProductSummary } from "@/models/product-model";
import { Category } from "@/models/category-model";
import ClientInteractivity from "./client-interactivity";
import { useTranslations } from "next-intl";
import {
  FilterValues,
  ProductSort,
  hasActiveFilters,
} from "@/validations/products-search-params.schema";

interface ProductsProps {
  result: Paginated<ProductSummary>;
  categories: Category[];
  filters: FilterValues;
  sort?: ProductSort;
  query?: string;
}

const Products = ({ result, categories, filters, sort, query }: ProductsProps) => {
  const t = useTranslations("products.plp");
  const showActiveFilters = hasActiveFilters(filters) || !!query;

  const breadcrumbLinks = [
    { href: "/", title: "Home" },
    { href: "/products", title: t("breadcrumb") },
  ];

  return (
    <div className="container">
      <CustomBreadcrumb links={breadcrumbLinks} />
      {query && (
        <h1 className="text-xl font-medium mt-2">
          {t("searchResults", { query, count: result.total })}
        </h1>
      )}
      <div className="w-full min-h-10">
        {showActiveFilters && (
          <ActiveFiltersDisplay
            filters={filters}
            query={query}
            categories={categories}
          />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 mb-4 lg:grid-cols-4 lg:gap-6 gap-4">
        <ClientInteractivity
          categories={categories}
          initialFilters={filters}
          sortBy={sort}
          currentPage={result.page}
          totalPages={result.totalPages}
        />
        <div className="lg:col-span-3 col-span-2 min-h-screen">
          {result.items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.items.map((product) => (
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
              {t("emptyState")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
