import { useTranslations } from "next-intl";
import { PiSealCheck, PiStorefront, PiTruck } from "react-icons/pi";

const ProductServices = () => {
  const t = useTranslations("products.pdp.productServices");
  return (
    <div className="flex justify-between text-primary py-3 border-b">
      <div className="flex items-center gap-1">
        <PiStorefront size={20} />
        <span className="text-xs font-medium text-gray-500">
          {t("inStock")}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <PiSealCheck size={20} />
        <span className="text-xs font-medium text-gray-500">
          {t("guarantee")}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <PiTruck size={20} />
        <span className="text-xs font-medium text-gray-500">
          {t("delivery")}
        </span>
      </div>
    </div>
  );
};

export default ProductServices;
