import { Link } from "@/i18n/routing";
import Button from "./ui/button";

const Navigation = () => {
  return (
    <nav className="hidden sm:block">
      <ul className="flex h-full items-center lg:gap-12">
        <li>
          <Button variant="link" asChild>
            <Link href="/">Home</Link>
          </Button>
        </li>
        <li>
          <Button variant="link" asChild>
            <Link href="/products">Products</Link>
          </Button>
        </li>
        <li>
          <Button variant="link" asChild>
            <Link href="/faq">FAQ</Link>
          </Button>
        </li>
        <li>
          <Button variant="link">
            <Link href="/contact-us">Contact Us</Link>
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
