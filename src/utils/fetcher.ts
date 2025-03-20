type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetcherConfigBase {
  path: string;
  method: HTTPMethod;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  token?: string;
}

interface FetcherConfigWithBody extends FetcherConfigBase {
  method: "POST" | "PUT";
  body: Record<string, unknown>;
}

type FetcherConfig = FetcherConfigBase | FetcherConfigWithBody;

class FetcherError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "FetcherError";
    this.status = status;
    this.data = data;
  }
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
    next: method === "GET" ? { revalidate: 360 } : undefined,
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
        throw new FetcherError(
          data.error?.message || data.message || res.statusText,
          res.status,
          data
        );
      }

      return data as T;
    } else {
      // Handle non-JSON responses (like file downloads)
      if (!res.ok) {
        throw new FetcherError(res.statusText, res.status);
      }

      // For non-JSON responses, return the raw response
      return res as unknown as T;
    }
  } catch (error) {
    if (error instanceof FetcherError) {
      throw error;
    }

    // Handle other errors
    console.error("Fetch error:", error);
    throw new FetcherError(
      error instanceof Error ? error.message : "Unknown fetch error",
      500
    );
  }
};

export default fetcher;
