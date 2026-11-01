import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components";

const ProfileLayout = async ({ children, params }: LayoutProps<"/[locale]">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default ProfileLayout;
