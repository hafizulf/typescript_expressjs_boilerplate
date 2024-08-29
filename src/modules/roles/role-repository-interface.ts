import { IRole, Role } from "./role-domain";
import BaseRepository from "../common/interfaces/base-repository-interface";

export interface IRoleRepository extends BaseRepository<Role, IRole> {}
