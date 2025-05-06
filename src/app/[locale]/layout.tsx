import type { Metadata } from "next";
import "@/styles/globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import UserInitializer from "@/components/user-initializer/userInitializer";

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

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-lvh">
        <NextIntlClientProvider messages={messages}>
          <UserInitializer />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
