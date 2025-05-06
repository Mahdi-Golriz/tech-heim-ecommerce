import { Hero, CategorySlider } from "@/components";
import NewProducts from "@/components/new-products/new-products";
import SaleSection from "@/components/sale-section/sale-section";

const HomePage = () => {
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
