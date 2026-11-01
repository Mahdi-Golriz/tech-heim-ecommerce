import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Products } from "@/components";
import { getCategories, getProducts } from "@/data/catalog";
import {
  parseProductsSearchParams,
  toFilterValues,
} from "@/validations/products-search-params.schema";

export const metadata: Metadata = {
  title: "Tech Heim | Products",
};

// Dynamic per search params; results are cached in the data layer
const PLPPage = async ({ params, searchParams }: PageProps<"/[locale]/products">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const parsed = parseProductsSearchParams(await searchParams);
  const [result, categories] = await Promise.all([
    getProducts(parsed),
    getCategories(),
  ]);

  return (
    <Products
      result={result}
      categories={categories}
      filters={toFilterValues(parsed)}
      sort={parsed.sort}
      query={parsed.q}
    />
  );
};

export default PLPPage;
