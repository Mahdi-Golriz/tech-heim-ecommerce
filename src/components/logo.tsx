import LogoImage from "@/assets/logo.svg";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="hidden sm:flex items-center ">
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
