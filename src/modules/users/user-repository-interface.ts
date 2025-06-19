import { IUser, UserDomain } from "./user-domain";
import BaseRepository from "../common/interfaces/base-repository-interface";
import { ICreateUserProps, TPropsUpdatePassword } from "./user-dto";
import { BaseQueryOption } from "../common/dto/common-dto";

export interface IUserRepository extends Omit<BaseRepository<UserDomain, IUser>, 'delete' | 'store'> {
  store(props: ICreateUserProps, option: BaseQueryOption): Promise<UserDomain>;
  update(id: string, props: Omit<IUser, "password">): Promise<UserDomain>;
  delete(id: string): Promise<UserDomain>;
  findByEmail(email: string): Promise<UserDomain>;
  findWithRoleByUserId(id: string): Promise<UserDomain>;
  updatePassword(props: TPropsUpdatePassword): Promise<boolean>;
  incrementTokenVersion(id: string): Promise<void>;
  countRegisteredUser(): Promise<number>;
  countActiveUser(): Promise<number>;
}
