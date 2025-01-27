import { inject, injectable } from "inversify";
import { IRoleMenuPermissionRepository } from "./role-menu-permission-repository-interface";
import { RoleMenuPermissionDto } from "./role-menu-permission-dto";
import TYPES from "@/types";

@injectable()
export class RoleMenuPermissionService {
  constructor(
    @inject(TYPES.IRoleMenuPermissionRepository)
    private _repository: IRoleMenuPermissionRepository
  ) {}

  public async findByRoleId(roleId: string): Promise<RoleMenuPermissionDto | []> {
    return await this._repository.findByRoleId(roleId);
  }
}
