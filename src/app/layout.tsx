import type { Metadata } from "next";
import "@/styles/globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import UserInitializer from "@/components/user-initializer/userInitializer";
import { Toaster } from "sonner";
import "leaflet/dist/leaflet.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500"],
});

export const metadata: Metadata = {
  title: "My Ecommerce Site",
  description: "An awesome ecommerce site built with Next.js",
};

interface Props {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
}

const RootLayout = async ({ children, params }: Props) => {
  // Wait for the params to resolve
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={poppins.className}>
      <body className="min-h-lvh">
        <NextIntlClientProvider messages={messages}>
          <UserInitializer />
          {children}
          <Toaster richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
