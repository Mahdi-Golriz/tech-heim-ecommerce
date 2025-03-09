"use client";

import { Button, Input } from "@/components";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  PiChats,
  PiCaretUp,
  PiUserLight,
  PiCaretRight,
  PiMapPinLineLight,
  PiPhoneCallLight,
  PiEnvelopeSimpleLight,
  PiCaretDown,
} from "react-icons/pi";
import CustomLink from "../sidebar-menu/custom-link";
import { useState } from "react";

const Footer = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const handleToggle = (id: number) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const t = useTranslations("footer.mainCategories");
  const footerLinks = [
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
        { title: t("contactUs.link-1"), icon: PiMapPinLineLight, href: "" },
        { title: t("contactUs.link-2"), icon: PiPhoneCallLight, href: "" },
        { title: t("contactUs.link-3"), icon: PiEnvelopeSimpleLight, href: "" },
      ],
    },
  ];

  return (
    <footer className="bg-primary-800 text-white py-4">
      <div className="container flex flex-col gap-4">
        <div className="flex justify-between">
          <Button
            variant="icon"
            className="border rounded-full p-2 bg-primary-50 size-10"
          >
            <PiChats />
          </Button>
          <Button
            variant="icon"
            className="border rounded-full p-2 bg-primary-50 [&_svg]:size-4 size-10"
          >
            <PiCaretUp className={cn("transition-transform")} />
          </Button>
        </div>
        <div className="p-2">
          <label htmlFor="email">Sign up for News and updates</label>
          <div className="w-full flex rounded-lg border mt-3 px-3">
            <div className="inset-y-0 start-0 flex items-center pointer-events-none">
              <PiUserLight />
            </div>
            <Input
              id="email"
              placeholder="E-mail Address"
              type="email"
              className="bg-transparent border-none pl-2"
            />
            <Button variant="icon" className="[&_svg]:size-3 px-2">
              <PiCaretRight color="white" />
            </Button>
          </div>
        </div>
        <ul>
          {footerLinks.map((item, i) => (
            <li key={i}>
              <Button
                variant="link"
                className="w-full justify-between px-0 [&_svg]:size-4 text-white text-base"
                onClick={() => handleToggle(i)}
              >
                {item.title}
                <PiCaretDown
                  color="gray"
                  className={cn("transition-transform", {
                    "rotate-180": openAccordion === i,
                  })}
                />
              </Button>
              <ul
                className={cn("hidden transition-all", {
                  "flex flex-col": openAccordion === i,
                })}
              >
                {item.links.map((item, i) => (
                  <CustomLink
                    key={String(i)}
                    href={item.href}
                    title={item.title}
                    // Icon={item.icon || undefined}
                    className="text-white"
                  />
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div></div>
      </div>
    </footer>
  );
};

export default Footer;
