"use client";

import { cn } from "@/lib/cn";
import { Button, Overlay, Logo } from "@/components";
import { useMemo, useState } from "react";
import {
  PiDeviceMobileCameraThin,
  PiLaptopLight,
  PiWatchLight,
  PiCameraLight,
  PiGameControllerLight,
  PiMouseSimpleLight,
  PiCaretDown,
  PiXCircleLight,
} from "react-icons/pi";
import { useTranslations } from "next-intl";
import { IconType } from "react-icons";
import CustomLink from "./custom-link";

interface SideBarMenuProps {
  onClose: VoidFunction;
  isOpen: boolean;
}

interface DirectLink {
  title: string;
  icon: IconType;
  href: string;
}

interface ParentLink {
  title: string;
  href: string;
  links?: DirectLink[];
}

const SideBarMenu = ({ onClose, isOpen }: SideBarMenuProps) => {
  const t = useTranslations();

  const productLinks: DirectLink[] = useMemo(() => {
    return [
      {
        title: t("products.mobilePhones"),
        icon: PiDeviceMobileCameraThin,
        href: "/products?page=1&categories=2",
      },
      {
        title: t("products.laptopsComputers"),
        icon: PiLaptopLight,
        href: "/products?page=1&categories=3",
      },
      {
        title: t("products.wearables"),
        icon: PiWatchLight,
        href: "/products?page=1&categories=5",
      },
      {
        title: t("products.cameras"),
        icon: PiCameraLight,
        href: "/products?page=1&categories=7",
      },
      {
        title: t("products.gaming"),
        icon: PiGameControllerLight,
        href: "/products?page=1&categories=8",
      },
      {
        title: t("products.accessories"),
        icon: PiMouseSimpleLight,
        href: "/products?page=1&categories=10",
      },
    ];
  }, [t]);

  const mainLinks: ParentLink[] = useMemo(() => {
    return [
      {
        title: t("burgerMenu.products"),
        href: "/products",
        links: productLinks,
      },
      { title: t("burgerMenu.aboutUs"), href: "/about-us" },
      { title: t("burgerMenu.faq"), href: "/faq" },
      { title: t("burgerMenu.contactUs"), href: "/contact-us" },
    ];
  }, [t, productLinks]);

  const [isShowedProducts, setIsShowedProducts] = useState(false);

  const handleCloseClick = () => {
    onClose();
    setIsShowedProducts(false);
  };

  return (
    <>
      {isOpen && (
        <Overlay onClick={handleCloseClick} className="overlay sm:hidden" />
      )}
      <aside
        className={cn(
          "bg-white w-64 fixed h-full inset-y-0 -left-64 z-50 sm:hidden p-4 text-gray-600 transition-all overflow-y-auto",
          {
            "left-0": isOpen,
          }
        )}
      >
        <div className="flex justify-between mb-4">
          <Logo className="flex size-11" />
          <Button
            variant="icon"
            className="p-0 h-fit hover:text-primary"
            onClick={handleCloseClick}
          >
            <PiXCircleLight />
          </Button>
        </div>
        <ul>
          {mainLinks.map((item) =>
            item.links ? (
              <li key={item.href}>
                <Button
                  variant="link"
                  className="w-full justify-between px-0 [&_svg]:size-4 text-gray-600 text-base"
                  onClick={() => setIsShowedProducts(!isShowedProducts)}
                >
                  {item.title}
                  <PiCaretDown
                    color="gray"
                    className={cn("transition-transform", {
                      "rotate-180": isShowedProducts,
                    })}
                  />
                </Button>
                <ul
                  className={cn("hidden", {
                    "flex flex-col": isShowedProducts,
                  })}
                >
                  {item.links.map((item, i) => (
                    <CustomLink
                      //TODO: USE HREF INSTEAD OF I
                      key={i}
                      href={item.href}
                      title={item.title}
                      Icon={item.icon}
                      onClick={handleCloseClick}
                    />
                  ))}
                </ul>
              </li>
            ) : (
              <CustomLink
                href={item.href}
                onClick={handleCloseClick}
                key={item.href}
                title={item.title}
              />
            )
          )}
        </ul>
      </aside>
    </>
  );
};

export default SideBarMenu;
