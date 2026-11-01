import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/data/session";
import { AppError } from "@/lib/errors";

/** Server client + verified user, or throws NOT_AUTHENTICATED. */
export const requireUser = async () => {
  const user = await getSessionUser();
  if (!user) throw new AppError("NOT_AUTHENTICATED", "Sign in required");
  const supabase = await createClient();
  return { supabase, user };
};
