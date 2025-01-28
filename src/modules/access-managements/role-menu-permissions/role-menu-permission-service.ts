import { inject, injectable } from "inversify";
import { IRoleMenuPermissionRepository } from "./role-menu-permission-repository-interface";
import {
  RoleMenuPermissionDto,
  TPropsBulkUpdateRoleMenuPermission
} from "./role-menu-permission-dto";
import TYPES from "@/types";

@injectable()
export class RoleMenuPermissionService {
  constructor(
    @inject(TYPES.IRoleMenuPermissionRepository)
    private _repository: IRoleMenuPermissionRepository
  ) {}

  public async findByRoleId(
    roleId: string
  ): Promise<RoleMenuPermissionDto | []> {
    return await this._repository.findByRoleId(roleId);
  }

  public async bulkUpdate(
    data: TPropsBulkUpdateRoleMenuPermission,
    updatedBy: string
  ): Promise<any> {
    const permissionsToUpdate = data.menus.flatMap((mp) =>
      mp.permissionList.map((p) => ({
        roleId: data.roleId,
        menuId: mp.menuId,
        permissionId: p.permissionId,
        isPermitted: p.isPermitted,
        updatedBy,
      }))
    );

    this._repository.bulkUpdate(permissionsToUpdate);

    return this.findByRoleId(data.roleId);
  }
}
