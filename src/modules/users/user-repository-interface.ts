import { IUser, UserDomain } from "./user-domain";
import BaseRepository from "../common/interfaces/base-repository-interface";
import { ICreateUserProps } from "./user-dto";

export interface IUserRepository extends BaseRepository<UserDomain, IUser> {
  store(props: ICreateUserProps): Promise<UserDomain>;
}
