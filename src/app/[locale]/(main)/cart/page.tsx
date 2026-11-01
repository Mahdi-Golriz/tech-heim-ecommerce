import { setRequestLocale } from "next-intl/server";
import { Cart } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Heim | Shopping Cart",
};

const CartPage = async ({ params }: PageProps<"/[locale]/cart">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mb-10">
      <Cart />
    </div>
  );
};

export default CartPage;
