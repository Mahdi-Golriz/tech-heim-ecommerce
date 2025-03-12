"use client";

import { useTranslations } from "next-intl";
import Button from "../ui/button";
import {
  PiCaretDown,
  PiEnvelopeSimpleLight,
  PiMapPinLineLight,
  PiPhoneCallLight,
} from "react-icons/pi";
import CustomLink from "../sidebar-menu/custom-link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { IconType } from "react-icons";

interface FooterLinks {
  title: string;
  links: { title: string; href: string; icon?: IconType }[];
}

const MobileFooterAccordion = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const handleToggle = (id: number) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };
  const t = useTranslations("footer.mainCategories");
  const footerLinks: FooterLinks[] = [
    {
      title: t("company.title"),
      links: [
        { title: t("company.link-1"), href: "" },
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
        { title: t("info.link-3"), href: "" },
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
    <ul className="lg:hidden">
      {footerLinks.map((item, i) => (
        <li key={i}>
          <Button
            variant="link"
            className="w-full justify-between px-0 [&_svg]:size-4 text-white text-base font-medium"
            onClick={() => handleToggle(i)}
          >
            {item.title}
            <PiCaretDown
              strokeWidth={10}
              color="white"
              className={cn("transition-transform", {
                "rotate-180": openAccordion === i,
              })}
            />
          </Button>
          <ul
            className={cn(
              "max-h-0 overflow-hidden transition-all duration-300 ease-in-out flex flex-col",
              {
                "max-h-96 py-2": openAccordion === i,
              }
            )}
          >
            {item.links.map((item, i) => (
              <CustomLink
                key={i}
                href={item.href}
                title={item.title}
                Icon={item.icon}
                className="text-white pl-2 font-light"
              />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default MobileFooterAccordion;
