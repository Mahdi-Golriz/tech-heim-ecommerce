import ProductDetails from "@/components/PDP";
import { Product } from "@/models/product-model";
import { DataResponse } from "@/models/response-model";
import fetcher from "@/utils/fetcher";

interface PDPPageProps {
  params: { id: string };
}

export const revalidate = 60;
export const dynamicParams = true;

// Fetch product data for a specific ID
const getProduct = async (productId: string): Promise<Product | null> => {
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
};

// Generate static params
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
  const product = await getProduct(params.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <ProductDetails product={product} productId={params.id} />
    </div>
  );
};

export default PDPPage;
