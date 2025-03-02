import { cn } from "@/lib/utils";
import Overlay from "./overlay";
import Logo from "./logo";
import Button from "./ui/button";
import { PiXCircleLight } from "react-icons/pi";
import { PiCaretDown } from "react-icons/pi";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { PiDeviceMobileCameraThin } from "react-icons/pi";
import { PiLaptopLight } from "react-icons/pi";
import { PiDeviceTabletSpeakerThin } from "react-icons/pi";
import { PiWatchLight } from "react-icons/pi";
import { PiHeadsetThin } from "react-icons/pi";
import { PiCameraLight } from "react-icons/pi";
import { PiGameControllerLight } from "react-icons/pi";
import { PiPlugsLight } from "react-icons/pi";
import { PiMouseSimpleLight } from "react-icons/pi";

interface Props {
  onClose: VoidFunction;
  isOpen: boolean;
}

const SideBarMenu = ({ onClose, isOpen }: Props) => {
  const [isShowedProducts, setIsShowedProducts] = useState<boolean>(false);

  return (
    <>
      {isOpen && <Overlay onClick={onClose} />}
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
            onClick={onClose}
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
              Products{" "}
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
              <li>
                <Button
                  variant="link"
                  asChild
                  className="[&_svg]:size-4 gap-1 h-fit"
                >
                  <Link href="/" className="text-gray-600 text-sm">
                    <PiDeviceMobileCameraThin />
                    Mobile Phones
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="[&_svg]:size-4 gap-1 h-fit"
                  asChild
                >
                  <Link href="/" className="text-gray-600 text-sm">
                    <PiLaptopLight />
                    Laptops & Computers
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="[&_svg]:size-4 gap-1 h-fit"
                  asChild
                >
                  <Link href="/" className="text-gray-600 text-sm">
                    <PiDeviceTabletSpeakerThin />
                    Tablets & E-reader
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="[&_svg]:size-4 gap-1 h-fit"
                  asChild
                >
                  <Link href="/" className="text-gray-600 text-sm">
                    <PiWatchLight />
                    Wearables
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="[&_svg]:size-4 gap-1 h-fit"
                  asChild
                >
                  <Link href="/" className="text-gray-600 text-sm">
                    <PiHeadsetThin />
                    Audio
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="[&_svg]:size-4 gap-1 h-fit"
                  asChild
                >
                  <Link href="/" className="text-gray-600 text-sm">
                    <PiCameraLight />
                    Cameras
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="[&_svg]:size-4 gap-1 h-fit"
                  asChild
                >
                  <Link href="/" className="text-gray-600 text-sm">
                    <PiGameControllerLight />
                    Gaming
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="[&_svg]:size-4 gap-1 h-fit"
                  asChild
                >
                  <Link href="/" className="text-gray-600 text-sm">
                    <PiPlugsLight />
                    Networking
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="[&_svg]:size-4 gap-1 h-fit"
                  asChild
                >
                  <Link href="/" className="text-gray-600 text-sm">
                    <PiMouseSimpleLight />
                    Accessories
                  </Link>
                </Button>
              </li>
            </ul>
          </li>
          <li>
            <Button variant="link" className="px-0 text-gray-600 text-base">
              Blog
            </Button>
          </li>
          <li>
            <Button variant="link" className="px-0 text-gray-600 text-base">
              FAQ
            </Button>
          </li>
          <li>
            <Button variant="link" className="px-0 text-gray-600 text-base">
              Contact Us
            </Button>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default SideBarMenu;
