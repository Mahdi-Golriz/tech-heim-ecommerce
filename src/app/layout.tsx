import type { Metadata } from "next";
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Tech Heim",
  description: "An awesome ecommerce site built with Next.js and Strapi",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
}

const RootLayout = async ({ children, params }: RootLayoutProps) => {
  // Wait for the params to resolve
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  return (
    <html lang={locale} className={poppins.className}>
      <body className="min-h-lvh">{children}</body>
    </html>
  );
};

export default RootLayout;
