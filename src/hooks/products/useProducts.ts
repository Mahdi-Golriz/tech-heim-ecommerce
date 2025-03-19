import { getProducts } from "@/api/products";
import { Product } from "@/models/product-model";
import { useEffect, useState } from "react";

interface UseProductsParams {
  params?: Record<string, string>;
}

const useProducts = ({ params }: UseProductsParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProducts({ params });
        setProducts(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch categories")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, isLoading, error };
};

export default useProducts;
