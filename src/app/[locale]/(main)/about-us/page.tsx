import { setRequestLocale } from "next-intl/server";
import AboutUs from "@/components/about-us/about-us";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Heim | About us",
};

const AboutUsPage = async ({ params }: PageProps<"/[locale]/about-us">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container">
      <AboutUs />
    </div>
  );
};

export default AboutUsPage;
