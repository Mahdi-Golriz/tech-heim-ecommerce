import { FC } from "react";
import Button from "../ui/button";
import {
  PiFacebookLogoLight,
  PiInstagramLogoLight,
  PiTwitterLogoLight,
  PiYoutubeLogoLight,
} from "react-icons/pi";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface SocialMediaIconsProps {
  className?: string;
}

const socialMedia = [
  PiFacebookLogoLight,
  PiTwitterLogoLight,
  PiInstagramLogoLight,
  PiYoutubeLogoLight,
];

const SocialMediaIcons: FC<SocialMediaIconsProps> = ({ className }) => {
  return (
    <div className={cn("[&_svg]:size-6", className)}>
      {socialMedia.map((Item, i) => (
        <Button variant="icon" className="p-0 h-fit" key={i}>
          <Link href="">
            <Item color="white" strokeWidth={10} />
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default SocialMediaIcons;
