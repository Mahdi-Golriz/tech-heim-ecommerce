import ProductDetails from "@/components/PDP";
import { Product } from "@/models/product-model";
import { DataResponse } from "@/models/response-model";
import fetcher from "@/utils/fetcher";
import { cache } from "react";

interface PDPPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export const revalidate = 60;
export const dynamicParams = true;

export const generateMetadata = async ({ params }: PDPPageProps) => {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: `Tech Heim | ${product?.title}`,
  };
};

// Fetch product data for a specific ID
const getProduct = cache(async (productId: string): Promise<Product | null> => {
  try {
    const productResponse = await fetcher<DataResponse<Product>>({
      path: `/api/products/${productId}`,
      params: { populate: "*" },
    });
    return productResponse.data || null;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
});

// Generate static params (ISR)
// Create the products Ids only for first page of PLP
export const generateStaticParams = async () => {
  const productsResponse = await fetcher<DataResponse<Product[]>>({
    path: "/api/products",
    params: {
      populate: "*",
      "pagination[page]": "1",
      "pagination[pageSize]": "12",
    },
  });

  return (productsResponse.data || []).map((product) => ({
    id: product.documentId,
  }));
};

const PDPPage = async ({ params }: PDPPageProps) => {
  console.log(params);
  const resolvedParams = await params;
  console.log(resolvedParams);
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <ProductDetails product={product} productId={resolvedParams.id} />
    </div>
  );
};

export default PDPPage;
