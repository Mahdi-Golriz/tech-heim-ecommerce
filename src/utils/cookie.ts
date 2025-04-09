import { getCookie, setCookie } from "cookies-next";
import { deleteCookie } from "cookies-next/client";

const cookieDomain =
  typeof window !== "undefined" ? window.location.hostname : undefined;

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  ...(cookieDomain && { domain: cookieDomain }),
  // httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export const setStrapiCookie = (jwt: string) => {
  setCookie("jwt", jwt, cookieConfig);
};

export const getStrapiCookie = () => {
  return getCookie("jwt");
};

export const deleteStrapiCookie = () => {
  deleteCookie("jwt");
};
