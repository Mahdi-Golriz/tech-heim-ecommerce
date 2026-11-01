import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/proxy";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // Locale detection/redirects first, then refresh the auth cookies on that response.
  const response = handleI18nRouting(request);
  return updateSession(request, response);
}

export const config = {
  // Skip API routes, Next internals and files with an extension (images, favicon, …)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
