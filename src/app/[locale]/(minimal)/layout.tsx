import { setRequestLocale } from "next-intl/server";
// Without header and footer
const MinimalLayout = async ({ children, params }: LayoutProps<"/[locale]">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default MinimalLayout;
