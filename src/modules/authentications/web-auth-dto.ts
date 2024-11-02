import { IUser } from "../users/user-domain";

export interface IResponseLogin {
  user: Pick<IUser, "id" | "fullName" | "avatarPath">;
  token?: string;
  refreshToken?: string;
}

export type TdecodedUserToken = {
  id: string;
  fullname: string;
  iat: number;
  exp: number;
}
