import { Button } from "@/components";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const NotFound = () => {
  const t = useTranslations("NotFound");

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
};

export default NotFound;
