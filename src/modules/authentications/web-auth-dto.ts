import { IUser } from "../users/user-domain";

export interface IResponseLogin {
  token?: string;
  user: Omit<IUser, "email" | "password" | "roleId" | "updatedBy" | "createdAt" | "updatedAt" | "deletedAt">;
}
