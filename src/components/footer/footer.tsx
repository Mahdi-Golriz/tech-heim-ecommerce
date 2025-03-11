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
  PiFacebookLogoLight,
  PiTwitterLogoLight,
  PiInstagramLogoLight,
  PiYoutubeLogoLight,
  PiCopyright,
} from "react-icons/pi";
import CustomLink from "../sidebar-menu/custom-link";
import { useState } from "react";
import { IconType } from "react-icons";
import visaImage from "@/assets/footer/visa.svg";
import paypalImage from "@/assets/footer/paypal.svg";
import masterCordImage from "@/assets/footer/master-card.svg";
import americanExpressImage from "@/assets/footer/american-express.svg";
import Image from "next/image";
import { Link } from "@/i18n/routing";

const Footer = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const handleToggle = (id: number) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const t = useTranslations("footer");
  const socialMedia = [
    PiFacebookLogoLight,
    PiTwitterLogoLight,
    PiInstagramLogoLight,
    PiYoutubeLogoLight,
  ];

  interface FooterLinks {
    title: string;
    links: { title: string; href: string; icon?: IconType }[];
  }

  const footerLinks: FooterLinks[] = [
    {
      title: t("mainCategories.company.title"),
      links: [
        { title: t("mainCategories.company.link-1"), href: "" },
        { title: t("mainCategories.company.link-2"), href: "" },
        { title: t("mainCategories.company.link-3"), href: "" },
        { title: t("mainCategories.company.link-4"), href: "" },
      ],
    },
    {
      title: t("mainCategories.info.title"),
      links: [
        { title: t("mainCategories.info.link-1"), href: "" },
        { title: t("mainCategories.info.link-2"), href: "" },
        { title: t("mainCategories.info.link-3"), href: "" },
      ],
    },
    {
      title: t("mainCategories.contactUs.title"),
      links: [
        {
          title: t("mainCategories.contactUs.link-1"),
          icon: PiMapPinLineLight,
          href: "",
        },
        {
          title: t("mainCategories.contactUs.link-2"),
          icon: PiPhoneCallLight,
          href: "",
        },
        {
          title: t("mainCategories.contactUs.link-3"),
          icon: PiEnvelopeSimpleLight,
          href: "",
        },
      ],
    },
  ];

  const secondaryLinks = [
    { title: t("secondaryLinks.cookieSettings"), href: "" },
    { title: t("secondaryLinks.privacyPolicy"), href: "" },
    { title: t("secondaryLinks.termsAndConditions"), href: "" },
    { title: t("secondaryLinks.imprint"), href: "" },
  ];

  return (
    <footer className="bg-primary-800 text-white">
      <div className="bg-radial-blue">
        <div className="container flex flex-col gap-4 py-4 lg:flex-row lg:justify-between">
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
          <div className="flex justify-between lg:order-1 lg:flex-col lg:justify-between">
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
              <PiCaretUp strokeWidth={10} />
            </Button>
          </div>
          <div className="p-2">
            <label htmlFor="email">{t("emailInput.label")}</label>
            <div className="w-full flex rounded-lg border-2 mt-3 px-3">
              <div className="inset-y-0 start-0 flex items-center pointer-events-none">
                <PiUserLight color="white" strokeWidth={10} />
              </div>
              <Input
                id="email"
                placeholder={t("emailInput.placeholder")}
                type="email"
                className="bg-transparent border-none pl-2 focus-visible:ring-0 focus-visible:ring-offset-0 lg:w-64"
              />
              <Button variant="icon" className="[&_svg]:size-3 px-2">
                <PiCaretRight color="white" strokeWidth={10} />
              </Button>
            </div>
            <div className="[&_svg]:size-6 gap-4 py-4 hidden lg:flex">
              {socialMedia.map((Item, i) => (
                <Button variant="icon" className="p-0 h-fit" key={i}>
                  <Link href="">
                    <Item color="white" strokeWidth={10} />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

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
                      key={String(i)}
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
        </div>
        <div className="container lg:flex gap-1 hidden mt-8">
          <Image src={visaImage} alt="visa" />
          <Image src={paypalImage} alt="paypal" />
          <Image src={americanExpressImage} alt="american express" />
          <Image src={masterCordImage} alt="master card" />
        </div>
      </div>
      <div className="container flex justify-between py-2 lg:hidden">
        <div className="flex gap-1">
          <Image src={visaImage} alt="visa" />
          <Image src={paypalImage} alt="paypal" />
          <Image src={americanExpressImage} alt="american express" />
          <Image src={masterCordImage} alt="master card" />
        </div>
        <div className="flex [&_svg]:size-6 gap-2">
          {socialMedia.map((Item, i) => (
            <Button variant="icon" className="p-0 h-fit" key={i}>
              <Link href="">
                <Item color="white" strokeWidth={10} />
              </Link>
            </Button>
          ))}
        </div>
      </div>
      <div className="container lg:flex justify-between items-center py-3 hidden">
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
      </div>
    </footer>
  );
};

export default Footer;
