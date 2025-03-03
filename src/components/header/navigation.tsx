import { Link } from "@/i18n/routing";
import { Button } from "@/components";
import { useTranslations } from "next-intl";

const Navigation = () => {
  const t = useTranslations("home.header.navigation");

  const navLinks = [
    { href: "/", title: t("home") },
    { href: "/products", title: t("products") },
    { href: "/faq", title: t("faq") },
    { href: "/contact-us", title: t("contactUs") },
  ];

  return (
    <nav className="hidden sm:block">
      <ul className="flex h-full items-center lg:gap-12">
        {navLinks.map((item) => (
          <li key={item.href}>
            <Button variant="link" asChild>
              <Link href={item.href}>{item.title}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
