import { getCategories } from "@/data/catalog";
import CategorySliderClient from "./category-slider-client";

const CategorySlider = async () => {
  const categories = await getCategories();
  return <CategorySliderClient categories={categories} />;
};

export default CategorySlider;
