import type { Tables } from "@/types/database.types";
import type { Profile } from "@/models/user-model";

export const toProfile = (
  row: Pick<
    Tables<"profiles">,
    "id" | "username" | "full_name" | "phone_number" | "address" | "postal_code"
  >
): Profile => ({
  id: row.id,
  username: row.username,
  fullName: row.full_name,
  phoneNumber: row.phone_number,
  address: row.address,
  postalCode: row.postal_code,
});
