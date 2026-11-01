import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/env";

/**
 * Cookie-less anonymous client for public catalog data. Safe to use in
 * statically rendered / ISR pages, generateStaticParams and cached functions.
 */
export const publicClient = createSupabaseClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
