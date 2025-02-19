import { Link } from "@/i18n/routing";
import { Button } from "./ui/button";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa";
import { GrBasket } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";
import { Input } from "./ui/input";
import Logo from "./logo";
import Navigation from "./navigation";

const Header = () => {
  return (
    <section className="sm:shadow-sm sm:shadow-blue-300">
      <header className="container flex flex-wrap items-center justify-between gap-3 sm:h-24">
        <div className="flex w-full justify-between">
          <Logo />
          <Navigation />
          <Button variant="icon" className="block sm:hidden">
            <GiHamburgerMenu />
          </Button>
          <Button variant="link" className="block sm:hidden">
            <Link href="/" className="text-primary-400 text-base">
              Tech Heim
            </Link>
          </Button>
          <div className="flex items-center">
            <Button variant="icon" className="hidden sm:block">
              <FiSearch />
            </Button>
            <Button variant="icon">
              <FaRegUser />
            </Button>
            <Button variant="icon">
              <GrBasket />
            </Button>
          </div>
        </div>
        <div className="w-full relative sm:hidden">
          <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none px-4">
            <FiSearch color="grey" />
          </div>
          <Input
            className="border-none bg-gray-100"
            placeholder="What can we help you to find ?"
          />
        </div>
      </header>
    </section>
  );
};

export default Header;
