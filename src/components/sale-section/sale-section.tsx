import { getSaleProducts } from "@/data/catalog";
import SaleSectionSlider from "./sale-section-slider";

const SaleSection = async () => {
  const products = await getSaleProducts();
  return <SaleSectionSlider products={products} />;
};

export default SaleSection;
