"use server";

import { fail, ok, type ActionResult } from "@/models/action-result";
import type { Profile } from "@/models/user-model";
import { fromZodError, toActionError } from "@/lib/errors";
import { updateProfile } from "@/services/profile.service";
import {
  getPersonalDataSchema,
  type PersonalDataFormValues,
} from "@/validations/get-personal-data-schema";
import { requireUser } from "./helpers";

export const updateProfileAction = async (
  input: PersonalDataFormValues
): Promise<ActionResult<Profile>> => {
  const parsed = getPersonalDataSchema().safeParse(input);
  if (!parsed.success) return fail(fromZodError(parsed.error));

  try {
    const { supabase, user } = await requireUser();
    // email is owned by Supabase Auth and intentionally ignored here
    const { fullName, phoneNumber, address, postalCode } = parsed.data;
    const profile = await updateProfile(supabase, user.id, {
      fullName,
      phoneNumber,
      address,
      postalCode,
    });
    return ok(profile);
  } catch (error) {
    return fail(toActionError(error));
  }
};
