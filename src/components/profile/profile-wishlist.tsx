"use client";

import { useTranslations } from "next-intl";
import ProductCard from "../new-products/product-cart";
import { ProductSummary } from "@/models/product-model";
import { useUserStore } from "@/store/user-store";

interface ProfileWishlistProps {
  products: ProductSummary[];
}

const ProfileWishlist = ({ products }: ProfileWishlistProps) => {
  const t = useTranslations("profile.wishlist");
  const status = useUserStore((s) => s.status);
  const wishlistIds = useUserStore((s) => s.wishlistIds);

  // Hide items the user un-hearts on this page without a refetch
  const visible =
    status === "authenticated"
      ? products.filter((product) => wishlistIds.includes(product.id))
      : products;

  if (!visible.length) {
    return <p className="my-10 text-gray-500">{t("emptyState")}</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-10">
      {visible.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          hasAddToCartButton
          wishlistButtonPosition="bottomRight"
        />
      ))}
    </div>
  );
};

export default ProfileWishlist;
