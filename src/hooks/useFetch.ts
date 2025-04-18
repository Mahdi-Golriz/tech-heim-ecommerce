import { useEffect, useState } from "react";
import fetcher, {
  FetcherConfig,
  FetcherErrorType,
  createFetcherError,
  isFetcherError,
} from "@/utils/fetcher";
import { getCookie } from "@/utils/cookie";

interface UseFetchParams<T> extends FetcherConfig {
  initialData?: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies?: any[];
  autoFetch?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface StrapiResponse<T> {
  data: T;

  meta?: {
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    } | null;
  };
}

function useFetch<T>({
  path,
  method = "GET",
  params,
  body: initialBody,
  headers,
  initialData,
  dependencies = [],
  autoFetch = true, // Default: fetch on mount
  onError,
  onSuccess,
}: UseFetchParams<T>) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FetcherErrorType | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (overrideConfig?: Partial<FetcherConfig>) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getCookie({ key: "jwt" });
      const fetcherParams = {
        path,
        method,
        params,
        headers,
        token,
        ...(["POST", "PUT"].includes(method)
          ? { body: overrideConfig?.body ?? initialBody }
          : {}),
        ...overrideConfig,
      };

      const response = await fetcher<StrapiResponse<T>>(fetcherParams);

      setData(response.data);
      onSuccess?.(response);
      // Set pagination if available
      if (response.meta?.pagination) {
        setTotalPages(response.meta.pagination.pageCount);
      }
    } catch (err) {
      const fetchError = isFetcherError(err)
        ? err
        : createFetcherError(
            err instanceof Error ? err.message : "Unknown fetch error",
            500
          );

      setError(fetchError);
      onError?.(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [
    autoFetch,
    path,
    method,
    JSON.stringify(params),
    JSON.stringify(initialBody),
    JSON.stringify(headers),
    ...dependencies,
  ]);

  return {
    data,
    isLoading,
    error,
    totalPages,
    fetchData,
    onError,
    onSuccess,
  };
}

export default useFetch;
