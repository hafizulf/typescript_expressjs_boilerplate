import { IUser, UserDomain } from "./user-domain";
import BaseRepository from "../common/interfaces/base-repository-interface";

export interface IUserRepository extends BaseRepository<UserDomain, IUser> {}
