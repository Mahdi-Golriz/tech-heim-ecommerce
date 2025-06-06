import { Button } from "@/components";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 mb-8">{t("description")}</p>
        <Button asChild>
          <Link href="/">{t("cta")}</Link>
        </Button>
      </div>
    </div>
  );
}
