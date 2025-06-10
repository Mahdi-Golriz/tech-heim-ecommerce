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

const getDefaultCookieConfig = (): CookieConfig => {
  const cookieDomain =
    typeof window !== "undefined" ? window.location.hostname : undefined;

  return {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    ...(cookieDomain && { domain: cookieDomain }),
    secure: process.env.NODE_ENV === "production",
  };
};

const cookies = new Cookies(null, { path: "/" });

export const setCookie = ({ key, value, config }: CookieParams) => {
  const defaultConfig = getDefaultCookieConfig();
  cookies.set(key, value, { ...defaultConfig, ...config });
};

export const getCookie = ({ key }: CookieParams) => {
  return cookies.get(key);
};

export const removeCookie = ({ key }: CookieParams) => {
  const { path, domain, secure } = getDefaultCookieConfig();
  cookies.remove(key, { path, domain, secure });
};
