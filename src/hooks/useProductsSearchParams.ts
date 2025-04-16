import { FilterValues } from "@/app/[locale]/products/_components/products-list";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type UrlParams = {
  [key: string]: string | number | null | undefined | boolean;
};

const useProductsSearchParams = () => {
  const searchParams = useSearchParams();

  const getUrlParams = (): {
    page: number;
    sortBy: string;
    filters: FilterValues;
  } => {
    const page = Number(searchParams.get("page") || 1);
    const sortBy = searchParams.get("sort") || "";
    const categories = searchParams.get("categories")?.split(",") || [];
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 2000);
    const hasDiscount = searchParams.get("hasDiscount") === "true";

    return {
      page,
      sortBy,
      filters: { categories, priceRange: [minPrice, maxPrice], hasDiscount },
    };
  };

  const { page, sortBy, filters } = getUrlParams();

  // API query parameters
  const queryParams = useMemo(() => {
    const params: UrlParams = {
      "pagination[page]": page,
      "pagination[pageSize]": 12,
      ...(sortBy && { sort: sortBy }),
      ...(filters.priceRange[0] > 0 && {
        "filters[price][$gt]": filters.priceRange[0],
      }),
      ...(filters.priceRange[1] < 2000 && {
        "filters[price][$lt]": filters.priceRange[1],
      }),
      ...(filters.hasDiscount && {
        "filters[discount_percentage][$notNull]": null,
      }),
    };

    // Add each category as filters[categories][index]
    filters.categories.forEach((categoryId, index) => {
      params[`filters[category][${index}]`] = categoryId;
    });

    return params;
  }, [page, sortBy, filters]);

  // Return the parsed values and API query parameters
  return {
    page,
    sortBy,
    filters,
    queryParams,
  };
};

export default useProductsSearchParams;
