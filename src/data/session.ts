import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { SessionUser } from "@/models/user-model";

/**
 * Verified current user for Server Components / Actions, or null.
 * getClaims() validates the JWT signature (locally with asymmetric keys).
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  return { id: claims.sub, email: claims.email ?? "" };
});
