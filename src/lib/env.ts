const required = (name: string, value: string | undefined) => {
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

// Accessed statically so Next can inline them into the client bundle.
export const SUPABASE_URL = required(
  "NEXT_PUBLIC_SUPABASE_URL",
  process.env.NEXT_PUBLIC_SUPABASE_URL
);
export const SUPABASE_PUBLISHABLE_KEY = required(
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);
