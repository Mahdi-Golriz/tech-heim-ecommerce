"use client";

import ProductCard from "./product-cart";
import SectionHeader from "../section-header/section-header";
import useProducts from "@/hooks/products/useProducts";
import { Product } from "@/models/product-model";

const NewProducts = () => {
  const { products: newProducts }: { products: Product[] } = useProducts({
    params: {
      "filters[new_collection][$eq]": "true",
    },
  });

  console.log(newProducts);

  return (
    <>
      <SectionHeader title="New Products" cta={{ text: "View all", url: "" }} />
      <div className="container mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newProducts.map((item) => (
            <ProductCard {...item} key={item.id} hasCartButton />
          ))}
        </div>
      </div>
    </>
  );
};

export default NewProducts;
