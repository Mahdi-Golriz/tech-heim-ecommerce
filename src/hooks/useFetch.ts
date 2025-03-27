import { useEffect, useState } from "react";
import fetcher, {
  FetcherConfig,
  FetcherErrorType,
  createFetcherError,
  isFetcherError,
} from "@/utils/fetcher";

interface UseFetchParams<T> extends FetcherConfig {
  initialData?: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies?: any[];
}

interface ResponseWithPagination<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

function useFetch<T>({
  path,
  method = "GET",
  params,
  body,
  headers,
  token,
  initialData,
  dependencies = [],
}: UseFetchParams<T>) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FetcherErrorType | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const fetcherParams = {
          path,
          method,
          params,
          headers,
          token,
          ...(["POST", "PUT"].includes(method) && body ? { body } : {}),
        };

        const response = await fetcher<ResponseWithPagination<T>>(
          fetcherParams
        );

        setData(response.data);

        // Set pagination if available
        if (response.meta?.pagination) {
          setTotalPages(response.meta.pagination.pageCount);
        }
      } catch (err) {
        setError(
          isFetcherError(err)
            ? err
            : createFetcherError(
                err instanceof Error ? err.message : "Unknown fetch error",
                500
              )
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Using JSON.stringify for objects in dependencies to properly track changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ...dependencies,
    path,
    method,
    JSON.stringify(params),
    JSON.stringify(body),
    JSON.stringify(headers),
    token,
  ]);

  return {
    data,
    isLoading,
    error,
    totalPages,
  };
}

export default useFetch;
