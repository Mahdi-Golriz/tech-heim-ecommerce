import useFetch from "@/hooks/useFetch";
import { User } from "@/models/user-model";
import ProductCard from "../new-products/product-cart";
import { useUserStore } from "@/store/user-store";

const ProfileWishlist = () => {
  const user = useUserStore((state) => state.user);

  const { data } = useFetch<User>({
    path: "/api/users/me",
    skipRequestIfNoToken: true,
    params: {
      "populate[wishlists][populate][product][populate]": "product_images",
    },

    dependencies: [user],
  });

  const wishlistProducts = data?.wishlists.map((item) => item.product);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-10">
      {wishlistProducts ? (
        wishlistProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            hasAddToCartButton
            wishlistButtonPosition="bottomRight"
          />
        ))
      ) : (
        <p>Is loading...</p>
      )}
    </div>
  );
};

export default ProfileWishlist;
