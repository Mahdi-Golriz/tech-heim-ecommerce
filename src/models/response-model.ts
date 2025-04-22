import { User } from "./user-model";

export interface DataResponse<T> {
  data: T;
  meta?: {
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    } | null;
  } | null;
}

export interface SigninResponse {
  user: User;
  jwt: string;
}
