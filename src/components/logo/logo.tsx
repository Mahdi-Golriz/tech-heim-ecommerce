import LogoImage from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";

interface Props {
  className?: string;
}

const Logo: FC<Props> = ({ className }) => {
  return (
    <div className={cn("hidden sm:flex items-center", className)}>
      <Image
        src={LogoImage}
        alt="Tech Heim Logo"
        width={56}
        height={63}
        className="sm:h-12 lg:h-16 lg:w-14"
      />
    </div>
  );
};

export default Logo;
