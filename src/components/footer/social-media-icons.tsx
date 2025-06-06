import Button from "../ui/button";
import {
  PiFacebookLogoLight,
  PiInstagramLogoLight,
  PiTwitterLogoLight,
  PiYoutubeLogoLight,
} from "react-icons/pi";
import { cn } from "@/lib/cn";

interface SocialMediaIconsProps {
  className?: string;
}

const socialMedia = [
  PiFacebookLogoLight,
  PiTwitterLogoLight,
  PiInstagramLogoLight,
  PiYoutubeLogoLight,
];

const SocialMediaIcons = ({ className }: SocialMediaIconsProps) => {
  return (
    <div className={cn("[&_svg]:size-6", className)}>
      {socialMedia.map((Item, i) => (
        <Button variant="icon" className="p-0 h-fit" key={i}>
          <span>
            <Item color="white" strokeWidth={10} />
          </span>
        </Button>
      ))}
    </div>
  );
};

export default SocialMediaIcons;
