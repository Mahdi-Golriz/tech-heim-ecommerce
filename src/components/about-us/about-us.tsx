import Image from "next/image";
import { Check } from "lucide-react";
import image from "@/assets/about-us/banner.png";
import { useTranslations } from "next-intl";
import CustomBreadcrumb from "../custom-breadcrumb/custom-breadcrumb";

interface FeatureItem {
  text: string;
}

const AboutUs = () => {
  const t = useTranslations("aboutUs");
  const features: FeatureItem[] = [
    { text: t("features.firstFeature") },
    {
      text: t("features.secondFeature"),
    },
    { text: t("features.thirdFeature") },
    { text: t("features.fourthFeature") },
    { text: t("features.fifthFeature") },
    { text: t("features.seventhFeature") },
    { text: t("features.eighthFeature") },
    { text: t("features.ninthFeature") },
  ];

  const links = [
    { href: "/", title: "Home" },
    {
      href: "",
      title: t("breadcrumb"),
    },
  ];

  return (
    <>
      <CustomBreadcrumb links={links} />
      <div className="py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={image}
              alt="Tech Helm team"
              fill
              className="absolute object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {t("introduction")}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                {t("description.title")}
              </h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {t("description.text")}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                {t("features.title")}
              </h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
