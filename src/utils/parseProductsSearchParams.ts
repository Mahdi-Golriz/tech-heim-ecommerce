// lib/parseProductsSearchParams.ts
import { ParsedUrlQuery } from "querystring";
import { FilterValues } from "@/components/PLP";

type UrlParams = {
  [key: string]: string | number | null | undefined | boolean;
};

export const parseProductsSearchParams = (query: ParsedUrlQuery) => {
  // Parse query parameters
  const page = Number(query.page || 1);
  const sortBy = (query.sort as string) || "";
  const categories = query.categories
    ? (query.categories as string).split(",")
    : [];
  const minPrice = Number(query.minPrice || 0);
  const maxPrice = Number(query.maxPrice || 2000);
  const hasDiscount = query.hasDiscount === "true";

  const filters: FilterValues = {
    categories,
    priceRange: [minPrice, maxPrice],
    hasDiscount,
  };

  // Construct API query parameters
  const queryParams: UrlParams = {
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
    queryParams[`filters[category][${index}]`] = categoryId;
  });

  return {
    page,
    sortBy,
    filters,
    queryParams,
  };
};
