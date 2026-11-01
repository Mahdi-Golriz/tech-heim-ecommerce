import { Link } from "@/i18n/routing";
import { Suspense } from "react";
import { Button, Logo, BurgerMenuButton } from "@/components";
import Navigation from "./navigation";
import { useTranslations } from "next-intl";
import SwitchLang from "./switch-lang";
import UserButton from "./user-button";
import ShoppingCartButton from "./shopping-cart/shopping-cart-button";
import SearchBar from "./search-bar";

const Header = () => {
  const t = useTranslations("home.header");

  return (
    <section className="sm:shadow-sm sm:shadow-blue-300">
      <header className="container sm:h-24">
        <div className="flex w-full justify-between py-2 sm:px-4 sm:p-0">
          <Logo />
          <Navigation />
          <BurgerMenuButton />
          <Button variant="link" className="block sm:hidden" asChild>
            <Link href="/" className="text-primary-400 text-base">
              {t("title")}
            </Link>
          </Button>
          {/* useSearchParams needs a Suspense boundary on static pages */}
          <Suspense>
            <SearchBar className="hidden md:block self-center w-56 lg:w-72" />
          </Suspense>
          <div className="flex items-center  sm:gap-2 gap-0 sm:h-24">
            <SwitchLang />
            <UserButton />
            <ShoppingCartButton />
          </div>
        </div>
      </header>
    </section>
  );
};

export default Header;
