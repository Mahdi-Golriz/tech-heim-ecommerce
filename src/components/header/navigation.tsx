import { Link } from "@/i18n/routing";
import { Button } from "@/components";

const navLinks = [
  { href: "/", title: "Home" },
  { href: "/products", title: "Products" },
  { href: "/faq", title: "FAQ" },
  { href: "/contact-us", title: "Contact Us" },
];

const Navigation = () => {
  return (
    <nav className="hidden sm:block">
      <ul className="flex h-full items-center lg:gap-12">
        {navLinks.map((item, i) => (
          <li key={i}>
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
