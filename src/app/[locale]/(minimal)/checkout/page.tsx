import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Checkout from "@/components/checkout";
import { getShippingMethods } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Tech Heim | Checkout",
};

const CheckoutPage = async ({ params }: PageProps<"/[locale]/checkout">) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const shippingMethods = await getShippingMethods();

  return (
    <div className="container">
      <Checkout shippingMethods={shippingMethods} />
    </div>
  );
};

export default CheckoutPage;
