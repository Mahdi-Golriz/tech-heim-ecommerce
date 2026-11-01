import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/env";

/**
 * Request-scoped client for Server Components, Server Actions and Route Handlers.
 * Reads the auth session from cookies, so any page using it renders dynamically.
 */
export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component: cookies are read-only there.
          // The proxy refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
};
