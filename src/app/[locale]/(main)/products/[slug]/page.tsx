import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ProductDetails from "@/components/PDP";
import { routing } from "@/i18n/routing";
import { getPrerenderSlugs, getProduct, getSimilarProducts } from "@/data/catalog";

// ISR: prerender the top products, generate the rest on first request
export const revalidate = 3600;
export const dynamicParams = true;

// Dedupe between generateMetadata and the page within one render
const loadProduct = cache((slug: string) => getProduct(slug));

export const generateStaticParams = async () => {
  const slugs = await getPrerenderSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
};

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/products/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) return { title: "Tech Heim" };
  return {
    title: `Tech Heim | ${product.title}`,
    description: product.description ?? undefined,
    openGraph: product.image ? { images: [product.image.url] } : undefined,
  };
};

const PDPPage = async ({ params }: PageProps<"/[locale]/products/[slug]">) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await loadProduct(slug);
  if (!product) notFound();

  const similarProducts = await getSimilarProducts(product.category.id, product.id);

  return <ProductDetails product={product} similarProducts={similarProducts} />;
};

export default PDPPage;
