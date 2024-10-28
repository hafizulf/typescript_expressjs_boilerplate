import { IUser, UserDomain } from "./user-domain";
import BaseRepository from "../common/interfaces/base-repository-interface";
import { ICreateUserProps, TPropsUpdatePassword } from "./user-dto";

export interface IUserRepository extends Omit<BaseRepository<UserDomain, IUser>, 'delete'> {
  store(props: ICreateUserProps): Promise<UserDomain>;
  update(id: string, props: Omit<IUser, "password">): Promise<UserDomain>;
  delete(id: string): Promise<UserDomain>;
  findByEmail(email: string): Promise<UserDomain>;
  updatePassword(props: TPropsUpdatePassword): Promise<boolean>;
}
