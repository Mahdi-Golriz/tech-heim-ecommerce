import { cn } from "@/lib/utils";
import { Button, Overlay, Logo } from "@/components";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import {
  PiDeviceMobileCameraThin,
  PiLaptopLight,
  PiDeviceTabletSpeakerThin,
  PiWatchLight,
  PiHeadsetThin,
  PiCameraLight,
  PiGameControllerLight,
  PiPlugsLight,
  PiMouseSimpleLight,
  PiCaretDown,
  PiXCircleLight,
} from "react-icons/pi";
import { useTranslations } from "next-intl";

interface Props {
  onClose: VoidFunction;
  isOpen: boolean;
}

const SideBarMenu = ({ onClose, isOpen }: Props) => {
  const t = useTranslations();

  const productLinks = useMemo(() => {
    return [
      { title: t("products.mobilePhones"), icon: PiDeviceMobileCameraThin },
      { title: t("products.laptopsComputers"), icon: PiLaptopLight },
      { title: t("products.tabletsEReader"), icon: PiDeviceTabletSpeakerThin },
      { title: t("products.wearables"), icon: PiWatchLight },
      { title: t("products.audio"), icon: PiHeadsetThin },
      { title: t("products.cameras"), icon: PiCameraLight },
      { title: t("products.gaming"), icon: PiGameControllerLight },
      { title: t("products.networking"), icon: PiPlugsLight },
      { title: t("products.accessories"), icon: PiMouseSimpleLight },
    ];
  }, [t]);

  const mainLinks = useMemo(() => {
    return [
      { title: t("burgerMenu.blog"), href: "/", id: 1 },
      { title: t("burgerMenu.faq"), href: "/faq", id: 2 },
      { title: t("burgerMenu.contactUs"), href: "/contact-us", id: 3 },
    ];
  }, [t]);

  const [isShowedProducts, setIsShowedProducts] = useState(false);

  return (
    <>
      {isOpen && (
        <Overlay
          onClick={() => {
            onClose();
            setIsShowedProducts(false);
          }}
        />
      )}
      <aside
        className={cn(
          "bg-white w-64 absolute h-screen -left-64 z-20 sm:hidden p-4 text-gray-600 transition-all",
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
            onClick={() => {
              onClose();
              setIsShowedProducts(false);
            }}
          >
            <PiXCircleLight />
          </Button>
        </div>
        <ul>
          <li>
            <Button
              variant="link"
              className="w-full justify-between px-0 [&_svg]:size-4 text-gray-600 text-base"
              onClick={() => setIsShowedProducts(!isShowedProducts)}
            >
              {t("burgerMenu.products")}
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
              {productLinks.map((item) => (
                <li key={item.title}>
                  <Button
                    variant="link"
                    asChild
                    className="[&_svg]:size-4 gap-1 h-fit"
                  >
                    <Link
                      href="/"
                      className="text-gray-600 text-sm"
                      onClick={() => {
                        onClose();
                        setIsShowedProducts(false);
                      }}
                    >
                      <item.icon />
                      {item.title}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </li>
          {mainLinks.map((item) => (
            <li key={item.id}>
              <Button
                variant="link"
                className="px-0 text-gray-600 text-base"
                asChild
              >
                <Link
                  href={item.href}
                  onClick={() => {
                    onClose();
                    setIsShowedProducts(false);
                  }}
                >
                  {item.title}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default SideBarMenu;
