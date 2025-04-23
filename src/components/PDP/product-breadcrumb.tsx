import CustomBreadcrumb from "../custom-breadcrumb/custom-breadcrumb";

const ProductDetailsBreadcrumb = ({ title }: { title: string }) => {
  const breadcrumbLinks = [
    { href: "/", title: "Home" },
    { href: "/products", title: "Products" },
    { href: "", title: title ?? "" },
  ];

  return <CustomBreadcrumb links={breadcrumbLinks} />;
};

export default ProductDetailsBreadcrumb;
