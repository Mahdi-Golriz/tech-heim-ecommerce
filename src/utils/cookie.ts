import Cookies from "universal-cookie";

interface CookieConfig {
  maxAge: number;
  path: string;
  domain?: string;
  secure: boolean;
}

interface CookieParams {
  key: string;
  value?: string;
  config?: Partial<CookieConfig>;
}

const cookieDomain =
  typeof window !== "undefined" ? window.location.hostname : undefined;

const defaultCookieConfig: CookieConfig = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  ...(cookieDomain && { domain: cookieDomain }),
  secure: process.env.NODE_ENV === "production",
};

const cookies = new Cookies(null, { path: "/" });

export const setCookie = ({
  key,
  value,
  config = defaultCookieConfig,
}: CookieParams) => {
  cookies.set(key, value, { ...defaultCookieConfig, ...config });
};

export const getCookie = ({ key }: CookieParams) => {
  return cookies.get(key);
};

export const removeCookie = ({ key }: CookieParams) => {
  cookies.remove(key);
};
