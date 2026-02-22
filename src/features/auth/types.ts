import type { Role } from "../../app/config/constants";

export type AppUser = {
  uid: string;
  email: string | null;
  role: Role;
};

export type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
  mobile: string;
  role?: Role;
};
