import Image from "next/image";
import heroImage from "@/assets/hero.png";
import { Button } from "@/components";
import { useTranslations } from "next-intl";

const Hero = () => {
  const t = useTranslations("home.hero");
  return (
    <section className="container my-6">
      <div className="flex relative justify-end text-primary-700">
        <div className="absolute left-0 flex flex-col h-full">
          <h2 className="text-2xl font-medium mb-2 lg:mb-12 lg:text-6xl sm:text-4xl">
            {t("title")}
          </h2>
          <p className="text-[9px] font-medium lg:text-4xl sm:text-xl">
            &quot;<span>{t("text")}&nbsp;</span>
            <span className="text-secondary">{t("subtext")}</span>&quot;
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-auto mb-2 lg:mb-14 w-fit sm:text-xl sm:w-full sm:h-12 lg:w-2/3 font-bold"
          >
            {t("cta")}
          </Button>
        </div>
        <Image
          src={heroImage}
          alt="tech heim"
          className="md:max-w-xl sm:max-w-96 w-2/3 lg:mr-10"
        />
      </div>
    </section>
  );
};

export default Hero;
