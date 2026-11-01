import ProductCard from "./product-cart";
import SectionHeader from "../section-header/section-header";
import { getTranslations } from "next-intl/server";
import { getNewProducts } from "@/data/catalog";

const NewProducts = async () => {
  const [t, newProducts] = await Promise.all([
    getTranslations("home.newProducts.header"),
    getNewProducts(),
  ]);

  return (
    <>
      <SectionHeader
        title={t("title")}
        cta={{ text: t("cta"), url: "/products?sort=newest" }}
      />
      <div className="container mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newProducts.map((item) => (
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
