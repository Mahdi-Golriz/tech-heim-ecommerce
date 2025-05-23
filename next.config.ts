import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntel = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default withNextIntel(nextConfig);
