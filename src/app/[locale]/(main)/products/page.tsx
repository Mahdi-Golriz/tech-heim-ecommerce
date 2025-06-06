import { Products } from "@/components";
import { Product } from "@/models/product-model";
import { DataResponse } from "@/models/response-model";
import fetcher from "@/utils/fetcher";
import { parseProductsSearchParams } from "@/utils/parseProductsSearchParams";
import { Metadata } from "next";

interface PLPProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: "Tech Heim | Products",
};

const PLPPage = async ({ searchParams }: PLPProps) => {
  const resolvedSearchParams = await searchParams;

  const parsedParams = parseProductsSearchParams(resolvedSearchParams);
  const { page, sortBy, filters, queryParams } = parsedParams;

  const cleanedQueryParams = Object.fromEntries(
    Object.entries(queryParams).filter(([, value]) => value !== undefined)
  );

  // Fetch products (SSR)
  let products: DataResponse<Product[]> | null = null;
  try {
    products = await fetcher({
      path: "/api/products",
      params: {
        populate: "*",
        ...cleanedQueryParams,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }

  return (
    <div>
      <Products
        products={products}
        page={page}
        sortBy={sortBy}
        filters={filters}
        totalPages={products?.meta?.pagination?.pageCount || 1}
      />
    </div>
  );
};

export default PLPPage;
