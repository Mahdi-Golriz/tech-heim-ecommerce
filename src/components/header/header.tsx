import { Link } from "@/i18n/routing";
import { PiMagnifyingGlassLight } from "react-icons/pi";
import { Input, Button, Logo, BurgerMenuButton } from "@/components";
import Navigation from "./navigation";
import { useTranslations } from "next-intl";
import SwitchLang from "./switch-lang";
import UserButton from "./user-button";
import ShoppingCartButton from "./shopping-cart/shopping-cart-button";

const Header = () => {
  const t = useTranslations("home.header");

  return (
    <section className="sm:shadow-sm sm:shadow-blue-300">
      <header className="container flex flex-wrap items-center justify-between gap-3 sm:h-24">
        <div className="flex w-full justify-between">
          <Logo />
          <Navigation />
          <BurgerMenuButton />
          <Button variant="link" className="block sm:hidden" asChild>
            <Link href="/" className="text-primary-400 text-base">
              {t("title")}
            </Link>
          </Button>
          <div className="flex items-center gap-2 sm:h-24">
            <SwitchLang />
            <Button variant="icon" size="icon" className="hidden sm:block">
              <PiMagnifyingGlassLight />
            </Button>
            <UserButton />
            <ShoppingCartButton />
          </div>
        </div>
        <div className="w-full relative sm:hidden">
          <MobileSearchInput />
        </div>
      </header>
    </section>
  );
};

export const MobileSearchInput = () => {
  return (
    <>
      <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none px-4">
        <PiMagnifyingGlassLight color="grey" />
      </div>
      <Input
        className="border-none bg-gray-100"
        placeholder="What can we help you to find ?"
      />
    </>
  );
};

export default Header;
