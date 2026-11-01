export interface SessionUser {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  username: string;
  fullName: string | null;
  phoneNumber: string | null;
  address: string | null;
  postalCode: string | null;
}
