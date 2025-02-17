import { Link } from "@/i18n/routing";
import { Button } from "./ui/button";

const Navigation = () => {
  return (
    <header className="container h-24">
      <nav>
        <ul className="flex items  justify-around">
          <li>
            <Button variant="link">
              <Link href="/">Home</Link>
            </Button>
          </li>
          <li>
            <Link href="/products">Products</Link>
          </li>
          <li>
            <Link href="/faq">FAQ</Link>
          </li>
          <li>
            <Link href="/contact">Contact Us</Link>
          </li>
        </ul>
      </nav>
      <div></div>
    </header>
  );
};

export default Navigation;
