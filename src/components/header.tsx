import { Link } from "@/i18n/routing";
import Button from "./ui/button";
import { PiUserLight } from "react-icons/pi";
import { PiBasketLight } from "react-icons/pi";
import { PiMagnifyingGlassLight } from "react-icons/pi";
import { Input } from "./ui/input";
import Logo from "./logo";
import Navigation from "./navigation";
import NavigationBurgerMenuButton from "./navigationBurgerMenuButton";

// const mobileLinks = [
//   { child: <GiHamburgerMenu /> },
//   {
//     child: (
//       <Link href="/" className="text-primary-400 text-base">
//         Tech Heim
//       </Link>
//     ),
//   },
// ];

const Header = () => {
  return (
    <section className="sm:shadow-sm sm:shadow-blue-300">
      <header className="container flex flex-wrap items-center justify-between gap-3 sm:h-24">
        <div className="flex w-full justify-between">
          <Logo />
          <Navigation />
          {/* {mobileLinks.map((item, i) => (
            <Button key={i}>{item.child}</Button>
          ))} */}
          <NavigationBurgerMenuButton />
          <Button variant="link" className="block sm:hidden">
            <Link href="/" className="text-primary-400 text-base">
              Tech Heim
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="icon" size="icon" className="hidden sm:block">
              <PiMagnifyingGlassLight />
            </Button>
            <Button variant="icon" size="icon">
              <PiUserLight />
            </Button>
            <Button variant="icon" size="icon">
              <PiBasketLight />
            </Button>
          </div>
        </div>
        <div className="w-full relative sm:hidden">
          <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none px-4">
            <PiMagnifyingGlassLight color="grey" />
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
