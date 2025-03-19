import { getCategory } from "@/api/categories";
import { Category } from "@/models/categories-model";
import { useEffect, useState } from "react";

interface UseCategoryParams {
  id: number | string;
}

const useCategory = ({ id }: UseCategoryParams) => {
  const [category, SetCategory] = useState<Category>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const response = await getCategory({ id });
        SetCategory(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch category")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  return { category, isLoading, error };
};
export default useCategory;
