import { PiCopyright } from "react-icons/pi";
import CustomLink from "../sidebar-menu/custom-link";
import { useTranslations } from "next-intl";

const FooterBottom = () => {
  const t = useTranslations("footer.secondaryLinks");
  const secondaryLinks = [
    { title: t("cookieSettings"), href: "" },
    { title: t("privacyPolicy"), href: "" },
    { title: t("termsAndConditions"), href: "" },
    { title: t("imprint"), href: "" },
  ];

  return (
    <>
      <div className="flex items-center gap-2">
        <PiCopyright size={30} />
        <span>2025 Tech Heim.</span>
      </div>
      <ul className="flex gap-12 ">
        {secondaryLinks.map((item, i) => (
          <CustomLink
            key={i}
            href={item.href}
            title={item.title}
            className="text-white"
          />
        ))}
      </ul>
    </>
  );
};

export default FooterBottom;
