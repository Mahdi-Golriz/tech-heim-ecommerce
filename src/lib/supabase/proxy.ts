import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database.types";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/env";

/**
 * Refreshes the Supabase auth session and writes the updated cookies onto the
 * given response (the one produced by the i18n middleware).
 */
export const updateSession = async (
  request: NextRequest,
  response: NextResponse
) => {
  const supabase = createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and getClaims(): it validates
  // the JWT and triggers the token refresh.
  await supabase.auth.getClaims();

  return response;
};
