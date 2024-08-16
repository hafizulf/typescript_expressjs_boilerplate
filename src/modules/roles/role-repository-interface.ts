import { IRole } from "./role-domain";

export interface IRoleRepository {
  findAll(): Promise<IRole[]>;
}
