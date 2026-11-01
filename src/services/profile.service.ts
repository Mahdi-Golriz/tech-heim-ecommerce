import type { TypedSupabaseClient } from "@/lib/supabase/types";
import { AppError, fromPostgrestError } from "@/lib/errors";
import { toProfile } from "@/mappers/profile.mapper";
import type { Profile } from "@/models/user-model";

const PROFILE_SELECT = "id, username, full_name, phone_number, address, postal_code" as const;

export const getProfile = async (
  client: TypedSupabaseClient,
  userId: string
): Promise<Profile | null> => {
  const { data, error } = await client
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw fromPostgrestError(error);
  return data ? toProfile(data) : null;
};

export interface ProfileUpdate {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  postalCode?: string;
}

const emptyToNull = (value: string | undefined) =>
  value === undefined ? undefined : value || null;

export const updateProfile = async (
  client: TypedSupabaseClient,
  userId: string,
  update: ProfileUpdate
): Promise<Profile> => {
  const { data, error } = await client
    .from("profiles")
    .update({
      full_name: emptyToNull(update.fullName),
      phone_number: emptyToNull(update.phoneNumber),
      address: emptyToNull(update.address),
      postal_code: emptyToNull(update.postalCode),
    })
    .eq("id", userId)
    .select(PROFILE_SELECT)
    .maybeSingle();

  if (error) throw fromPostgrestError(error);
  if (!data) throw new AppError("NOT_AUTHENTICATED", "Profile not found");
  return toProfile(data);
};
