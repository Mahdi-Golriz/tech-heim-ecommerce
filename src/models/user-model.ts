export interface User {
  username: string;
  name: string;
  email: string;
}

export type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
};
