"use client";

import ProductCard from "./product-cart";
import SectionHeader from "../section-header/section-header";

import { Product } from "@/models/product-model";
import useFetch from "@/hooks/useFetch";

const NewProducts = () => {
  const { data: newProducts } = useFetch<Product[]>({
    path: "/api/products",
    params: {
      populate: "*",
      "filters[new_collection][$eq]": "true",
      "pagination[pageSize]": "4",
    },
  });

  return (
    <>
      <SectionHeader title="New Products" cta={{ text: "View all", url: "" }} />
      <div className="container mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newProducts?.map((item) => (
            <ProductCard {...item} key={item.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default NewProducts;
