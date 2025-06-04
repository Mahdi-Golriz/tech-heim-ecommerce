import { useTranslations } from "next-intl";
import CustomBreadcrumb from "../custom-breadcrumb/custom-breadcrumb";

const ProductDetailsBreadcrumb = ({ title }: { title: string }) => {
  const t = useTranslations("products.pdp");

  const breadcrumbLinks = [
    { href: "/", title: "Home" },
    { href: "/products", title: t("breadcrumb") },
    { href: "", title: title ?? "" },
  ];

  return <CustomBreadcrumb links={breadcrumbLinks} />;
};

export default ProductDetailsBreadcrumb;
