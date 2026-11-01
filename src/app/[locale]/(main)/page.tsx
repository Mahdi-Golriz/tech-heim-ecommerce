import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components";
import CategorySlider from "@/components/category-slider/category-slider";
import NewProducts from "@/components/new-products/new-products";
import SaleSection from "@/components/sale-section/sale-section";

// ISR: catalog sections are re-fetched at most once an hour
export const revalidate = 3600;

const HomePage = async ({ params }: PageProps<"/[locale]">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <Hero />
      <CategorySlider />
      <SaleSection />
      <NewProducts />
    </div>
  );
};

export default HomePage;
