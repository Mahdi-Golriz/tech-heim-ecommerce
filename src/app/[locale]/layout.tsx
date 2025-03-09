import type { Metadata } from "next";
import "@/styles/globals.css";
import { redirect, routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components";
import Footer from "@/components/footer/footer";

export const metadata: Metadata = {
  title: "My Ecommerce Site",
  description: "An awesome ecommerce site built with Next.js",
};

interface Props {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: Props) {
  // Wait for the params to resolve
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as "en" | "de")) {
    redirect({
      href: "/",
      locale: routing.defaultLocale,
    });
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
