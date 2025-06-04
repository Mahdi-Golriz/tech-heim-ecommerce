import LogoImage from "@/assets/logo.svg";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";

interface Props {
  className?: string;
}

const Logo: FC<Props> = ({ className }) => {
  return (
    <Link href="/" className="my-auto h-fit hidden sm:flex">
      <div className={cn("items-center", className)}>
        <Image
          src={LogoImage}
          alt="Tech Heim Logo"
          width={56}
          height={63}
          className="sm:h-12 lg:h-16 lg:w-14"
        />
      </div>
    </Link>
  );
};

export default Logo;
