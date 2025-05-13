import { useCartStore } from "@/store/cart-store";
import Image from "next/image";

const CheckoutItemsList = () => {
  const items = useCartStore((state) => state.items);
  return (
    <ul className="hidden md:block">
      {items.map((item) => (
        <li key={item.createdAt} className="flex p-1 gap-1 border-b">
          {item.product.product_images && (
            <Image
              src={
                process.env.NEXT_PUBLIC_API_URL +
                item.product.product_images[0].url
              }
              alt={item.product.title}
              width={87}
              height={74}
              className="object-scale-down object-center"
            />
          )}
          <div className="p-1 text-gray-600 grow">
            <h3 className="line-clamp-1 text-xs">{item.product.title}</h3>
            <p className="text-[10px] my-1">{item.color}</p>
            <p className="text-[10px]">x{item.quantity}</p>
            <p className="text-end">
              {item.product.discount_percentage ? (
                <>
                  <span className="text-[10px] line-through mr-3">
                    $ {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <span className="text-xs ">
                    ${" "}
                    {(
                      (item.product.price -
                        (item.product.discount_percentage / 100) *
                          item.product.price) *
                      item.quantity
                    ).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-xs">
                  $ {(item.product.price * item.quantity).toFixed(2)}
                </span>
              )}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CheckoutItemsList;
