import { getCookie, setCookie } from "cookies-next";

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain:
    typeof window !== "undefined" ? window.location.hostname : "localhost",
  // httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export const setStrapiCookie = (jwt: string) => {
  setCookie("jwt", jwt, cookieConfig);
};

export const getStrapiCookie = () => {
  return getCookie("jwt");
};
