export type Role = "recruiter" | "student";

export interface User {
  id: string;
  _id?: string;
  fullname: string;
  email: string;
  role: Role;
  phoneNumber?: string;
  profileBio?: string;
  profileSkills?: string[];
  profilePhoto?: string;
  resume?: string;
  createdAt?: string;
  updatedAt?: string;
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
