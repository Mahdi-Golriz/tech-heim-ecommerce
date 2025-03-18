import { Category } from "@/models/categories-model";
import fetcher from "@/utils/fetcher";

interface GetCategoriesParams {
  params?: Record<string, string>;
}

interface GetCategoryParams {
  id: number | string;
}

interface CategoriesResponse {
  data: Category[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface CategoryResponse {
  data: Category;
}

export const getCategories = async ({ params }: GetCategoriesParams) => {
  return fetcher<CategoriesResponse>({
    path: "/api/categories?populate=*",
    method: "GET",
    params,
  });
};

export const getCategory = async ({ id }: GetCategoryParams) => {
  return fetcher<CategoryResponse>({
    path: `/api/categories/${id}`,
    method: "GET",
  });
};
