import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/env";

// createBrowserClient returns a singleton in the browser.
export const createClient = () =>
  createBrowserClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
