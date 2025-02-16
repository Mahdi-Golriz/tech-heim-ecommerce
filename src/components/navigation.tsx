import Link from "next/link";

const Navigation = () => {
  return (
    <header className="container h-24">
      <nav>
        <ul className="flex items  justify-around">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/products">Products</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
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
