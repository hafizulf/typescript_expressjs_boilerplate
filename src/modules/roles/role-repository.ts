import { injectable } from "inversify";
import { IRoleRepository } from "./role-repository-interface";
import { IRole } from "./role-domain";
import { Role as RolePersistence } from "@/modules/common/sequelize";

@injectable()
export class RoleRepository implements IRoleRepository {

  async findAll(): Promise<IRole[]> {
    const role = await RolePersistence.findAll();
    return role;
  }
}
