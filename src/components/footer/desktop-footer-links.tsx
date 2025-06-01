import { useTranslations } from "next-intl";
import {
  PiEnvelopeSimpleLight,
  PiMapPinLineLight,
  PiPhoneCallLight,
} from "react-icons/pi";
import CustomLink from "../sidebar-menu/custom-link";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";

interface FooterLinks {
  title: string;
  links: { title: string; href: string; icon?: IconType }[];
}

const DesktopFooterLinks = () => {
  const t = useTranslations("footer.mainCategories");
  const footerLinks: FooterLinks[] = [
    {
      title: t("company.title"),
      links: [
        { title: t("company.link-1"), href: "/about-us" },
        { title: t("company.link-2"), href: "" },
        { title: t("company.link-3"), href: "" },
        { title: t("company.link-4"), href: "" },
      ],
    },
    {
      title: t("info.title"),
      links: [
        { title: t("info.link-1"), href: "" },
        { title: t("info.link-2"), href: "" },
        { title: t("info.link-3"), href: "faq" },
      ],
    },
    {
      title: t("contactUs.title"),
      links: [
        {
          title: t("contactUs.link-1"),
          icon: PiMapPinLineLight,
          href: "",
        },
        {
          title: t("contactUs.link-2"),
          icon: PiPhoneCallLight,
          href: "",
        },
        {
          title: t("contactUs.link-3"),
          icon: PiEnvelopeSimpleLight,
          href: "",
        },
      ],
    },
  ];

  return (
    <ul className="hidden lg:flex lg:gap-24 xl:gap-48">
      {footerLinks.map((item, i) => (
        <li key={i}>
          <h5 className="py-2">{item.title}</h5>
          <ul>
            {item.links.map((item, i) => (
              <CustomLink
                key={i}
                href={item.href}
                title={item.title}
                Icon={item.icon}
                className={cn("text-gray-200 font-light py-1 h-fit", {
                  "px-0": item.icon,
                })}
              />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};
export default DesktopFooterLinks;
