import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Poppins } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Toaster } from "sonner";
import { routing } from "@/i18n/routing";
import SessionInitializer from "@/components/session-initializer/session-initializer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Tech Heim",
  description: "An awesome ecommerce site built with Next.js and Supabase",
};

export const generateStaticParams = () =>
  routing.locales.map((locale) => ({ locale }));

const LocaleLayout = async ({ children, params }: LayoutProps<"/[locale]">) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enables static rendering for everything below this layout
  setRequestLocale(locale);

  return (
    <html lang={locale} className={poppins.className}>
      <body className="min-h-lvh">
        <NextIntlClientProvider>
          {/* Hydrates the auth session, cart and wishlist on the client */}
          <SessionInitializer />
          <Toaster richColors />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
