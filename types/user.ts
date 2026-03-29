export type Role = "recruiter" | "student";

export interface User {
  id: string;
  role: Role;
}

export interface UserData {
  user?: User;
  token?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface StoredUserData {
  role?: Role;
  token?: string;
  id?: string;
  [key: string]: unknown;
}
