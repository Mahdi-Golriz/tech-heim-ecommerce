type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface FetcherConfig {
  path: string;
  method?: HTTPMethod;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  token?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: Record<string, any> | null;
}

interface FetcherErrorType extends Error {
  name: string;
  status: number;
  data?: unknown;
}

function createFetcherError(
  message: string,
  status: number,
  data?: unknown
): FetcherErrorType {
  const error = new Error(message) as FetcherErrorType;
  error.name = "FetcherError";
  error.status = status;
  if (data !== undefined) {
    error.data = data;
  }
  return error;
}

// Type guard to check if an error is a FetcherError
function isFetcherError(error: unknown): error is FetcherErrorType {
  return (
    error instanceof Error && error.name === "FetcherError" && "status" in error
  );
}

/**
 * Handles API requests to Strapi backend
 * @param config - The fetcher configuration
 * @returns Promise with the response data
 */

const fetcher = async <T>(config: FetcherConfig): Promise<T> => {
  const { path, method, headers: customHeaders = {}, params, token } = config;
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${path}`);

  // const locale = document.cookie
  //   .split("; ")
  //   .find((row) => row.startsWith("NEXT_LOCALE="))
  //   ?.split("=")[1];

  // if (locale && method !== "POST") {
  //   url.searchParams.append("locale", locale);
  // }

  // Append additional query params if present
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...customHeaders,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    // cache: method === "GET" ? "force-cache" : "no-store",
    // next: method === "GET" ? { revalidate: 360 } : undefined,
  };

  if ("body" in config) {
    options.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url.toString(), options);
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      if (!res.ok) {
        throw createFetcherError(
          data.error?.message || data.message || res.statusText,
          res.status,
          data
        );
      }

      return data as T;
    } else {
      // Handle non-JSON responses (like file downloads)
      if (!res.ok) {
        throw createFetcherError(res.statusText, res.status);
      }

      // For non-JSON responses, return the raw response
      return res as unknown as T;
    }
  } catch (error) {
    if (isFetcherError(error)) {
      throw error;
    }

    // Handle other errors
    console.error("Fetch error:", error);
    throw createFetcherError(
      error instanceof Error ? error.message : "Unknown fetch error",
      500
    );
  }
};

export {
  fetcher as default,
  createFetcherError,
  isFetcherError,
  type FetcherErrorType,
};
