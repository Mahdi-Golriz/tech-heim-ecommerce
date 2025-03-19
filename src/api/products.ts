import { Product } from "@/models/product-model";
import fetcher from "@/utils/fetcher";

interface GetProductsParams {
  params?: Record<string, string>;
}

interface ProductsResponse {
  data: Product[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const getProducts = async ({ params }: GetProductsParams) => {
  return fetcher<ProductsResponse>({
    method: "GET",
    path: "/api/products?populate=*",
    params,
  });
};

export const getProduct = () => {};
