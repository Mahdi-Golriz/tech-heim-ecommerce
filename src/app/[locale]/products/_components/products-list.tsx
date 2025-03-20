"use client";

import ProductCard from "@/components/new-products/product-cart";
import useProducts from "@/hooks/products/useProducts";

const ProductsList = () => {
  const { products } = useProducts({});

  return (
    <div className="container grid grid-cols-2 my-4 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} hasCartButton />
      ))}
    </div>
  );
};

export default ProductsList;
