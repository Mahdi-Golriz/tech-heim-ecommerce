import macImage from "@/assets/new-products/apple-macbook.png";
import ProductCard, { NewProduct } from "./product-cart";
import SectionHeader from "../section-header/section-header";

const newProductsItem: NewProduct = {
  id: 1,
  image: macImage,
  title: "Iphone 14 promax 256 gig",
  colorVariant: ["green", "white", "black", "red"],
  totalPrice: 1000,
  salePrice: 930.9,
  rate: 4.5,
};

const newProductsItems: NewProduct[] = Array.from({ length: 4 }, (_, i) => ({
  ...newProductsItem,
  id: i,
}));

const NewProducts = () => {
  return (
    <>
      <SectionHeader title="New Products" cta={{ text: "View all", url: "" }} />
      <div className="container mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newProductsItems.map((item) => (
            <ProductCard {...item} key={item.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default NewProducts;
