import type { Metadata } from "next";
import "@/app/_styles/globals.css";

export const metadata: Metadata = {
  title: "My Ecommerce Site",
  description: "An awesome ecommerce site built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
