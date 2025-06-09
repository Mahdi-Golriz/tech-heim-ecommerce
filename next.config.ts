import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntel = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: process.env.IMAGE_HOSTNAME || "localhost",
      },
    ],
  },
};

export default withNextIntel(nextConfig);
