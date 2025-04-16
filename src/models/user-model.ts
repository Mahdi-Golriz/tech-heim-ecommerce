export interface User {
  username: string;
  email: string;
}

export type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};
