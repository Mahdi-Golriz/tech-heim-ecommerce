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
  autoFetch?: boolean; // <-- New flag to control execution
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
  autoFetch = true, // Default: fetch on mount
}: UseFetchParams<T>) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FetcherErrorType | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(autoFetch); // Control API execution

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await fetcher<any>(fetcherParams);

      setData(response);

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

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
    }
  }, [
    shouldFetch,
    path,
    method,
    JSON.stringify(params),
    JSON.stringify(body),
    JSON.stringify(headers),
    token,
    ...dependencies,
  ]);

  return {
    data,
    isLoading,
    error,
    totalPages,
    refetch: () => setShouldFetch((prev) => !prev),
  };
}

export default useFetch;
