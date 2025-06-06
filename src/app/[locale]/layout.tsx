import "@/styles/globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import UserInitializer from "@/components/user-initializer/userInitializer";
import "leaflet/dist/leaflet.css";
import { Toaster } from "sonner";

interface LocaleLayoutProps {
  children: React.ReactNode;
}

const LocaleLayout = async ({ children }: LocaleLayoutProps) => {
  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {/* fetch fresh user data and set user store */}
      <UserInitializer />
      <Toaster richColors />
      {children}
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
