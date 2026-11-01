import Link from "next/link";

// Fallback for requests that never reach a [locale] segment.
const GlobalNotFound = () => (
  <html lang="en">
    <body style={{ fontFamily: "sans-serif", textAlign: "center", paddingTop: "20vh" }}>
      <h1>404 – Page not found</h1>
      <Link href="/">Go to the homepage</Link>
    </body>
  </html>
);

export default GlobalNotFound;
