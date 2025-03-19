import { getCategories } from "@/api/categories";
import { Category } from "@/models/categories-model";
import { useEffect, useState } from "react";

interface UseCategoriesParams {
  params?: Record<string, string>;
}

const useCategories = ({ params }: UseCategoriesParams) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await getCategories({ params });
        setCategories(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch categories")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [params]);

  return { categories, isLoading, error };
};

export default useCategories;
