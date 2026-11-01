import { setRequestLocale } from "next-intl/server";
import { CustomBreadcrumb } from "@/components";
import FAQSection from "@/components/faq/faq";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Heim | FAQ",
};

const links = [
  { href: "/", title: "Home" },
  {
    href: "",
    title: "FAQs",
  },
];

const FaqPage = async ({ params }: PageProps<"/[locale]/faq">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container">
      <CustomBreadcrumb links={links} />
      <FAQSection />
    </div>
  );
};

export default FaqPage;
