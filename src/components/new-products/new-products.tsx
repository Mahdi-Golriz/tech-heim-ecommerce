"use client";

import ProductCard from "./product-cart";
import SectionHeader from "../section-header/section-header";

import { Product } from "@/models/product-model";
import useFetch from "@/hooks/useFetch";
import { DataResponse } from "@/models/response-model";
import { useTranslations } from "next-intl";

const NewProducts = () => {
  const t = useTranslations("home.newProducts.header");
  const { data: newProducts } = useFetch<DataResponse<Product[]>>({
    path: "/api/products",
    params: {
      populate: "*",
      sort: "createdAt:desc",
      "pagination[pageSize]": "4",
    },
  });

  return (
    <>
      <SectionHeader
        title={t("title")}
        cta={{
          text: t("cta"),
          url: "/products?sort=createdAt%3Adesc&page=1",
        }}
      />
      <div className="container mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newProducts?.data.map((item) => (
            <ProductCard
              product={item}
              key={item.id}
              hasAddToCartButton={false}
              wishlistButtonPosition="topLeft"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default NewProducts;
