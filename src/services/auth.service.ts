import type { TypedSupabaseClient } from "@/lib/supabase/types";
import type { SignInSchema, SignUpSchema } from "@/validations/get-auth-schema";

/**
 * Auth runs on the browser client so onAuthStateChange fires immediately and
 * the session cookies are written for the server. Supabase validates server-side.
 */
export const signIn = async (client: TypedSupabaseClient, input: SignInSchema) => {
  const { error } = await client.auth.signInWithPassword({
    email: input.identifier,
    password: input.password,
  });
  if (error) throw error;
};

/** Returns whether the user must confirm their email before a session exists. */
export const signUp = async (
  client: TypedSupabaseClient,
  input: SignUpSchema
): Promise<{ needsConfirmation: boolean }> => {
  const { data, error } = await client.auth.signUp({
    email: input.email,
    password: input.password,
    // copied into public.profiles by the handle_new_user trigger
    options: { data: { username: input.username } },
  });
  if (error) throw error;
  return { needsConfirmation: !data.session };
};

export const signOut = async (client: TypedSupabaseClient) => {
  const { error } = await client.auth.signOut();
  if (error) throw error;
};
