import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const [, locale, ...secondPartArray] = request.nextUrl.pathname.split("/");
  const secondPart = secondPartArray.join("/");

  // If the locale is not one of the allowed locales, redirect to the default locale (en)
  if (!routing.locales.includes(locale as "en" | "de")) {
    return NextResponse.redirect(
      // new URL(routing.defaultLocale, request.nextUrl.origin)
      new URL(`${routing.defaultLocale}/${secondPart}`, request.nextUrl.origin)
    );
  }

  // Otherwise, continue with next-intl middleware
  const intlMiddleware = createMiddleware(routing);
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
