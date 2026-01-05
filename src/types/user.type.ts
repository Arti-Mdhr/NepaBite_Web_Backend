export type UserRole = "user" | "admin";

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}
