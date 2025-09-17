import { inject, injectable } from "inversify";
import { IRoleMenuPermission } from "./role-menu-permission-domain";
import { IRoleMenuPermissionRepository } from "./role-menu-permission-repository-interface";
import {
  RoleMenuPermissionDto,
  TPropsBulkUpdateRoleMenuPermission,
  TPropsCreateRoleMenuPermission
} from "./role-menu-permission-dto";
import TYPES from "@/types";
import { RoleMenuPermissionCache } from "./role-menu-permission-cache";

@injectable()
export class RoleMenuPermissionService {
  constructor(
    @inject(TYPES.IRoleMenuPermissionRepository)
    private _repository: IRoleMenuPermissionRepository,
    @inject(TYPES.RoleMenuPermissionCache) 
    private _roleMenuPermissionCache: RoleMenuPermissionCache,
  ) {}

  public async findByRoleId(
    roleId: string
  ): Promise<RoleMenuPermissionDto | []> {
    return await this._repository.findByRoleId(roleId);
  }

  public async bulkUpdate(
    data: TPropsBulkUpdateRoleMenuPermission,
    updatedBy: string
  ): Promise<RoleMenuPermissionDto | []> {
    const permissionsToUpdate = data.menus.flatMap((mp) =>
      mp.permissionList.map((p) => ({
        roleId: data.roleId,
        menuId: mp.menuId,
        permissionId: p.permissionId,
        isPermitted: p.isPermitted,
        updatedBy,
      }))
    );

    await this._repository.bulkUpdate(permissionsToUpdate);

    const updatedData = await this.findByRoleId(data.roleId);
    const getCachedData = await this._roleMenuPermissionCache.get(data.roleId);
    if (!Array.isArray(getCachedData)) {
      this._roleMenuPermissionCache.set(data.roleId, updatedData);
    }

    return updatedData;
  }

  public async store(
    props: TPropsCreateRoleMenuPermission
  ): Promise<IRoleMenuPermission> {
    return ((await this._repository.store(props)).unmarshal());
  }

  public async update(
    props: IRoleMenuPermission
  ): Promise<IRoleMenuPermission> {
    const updated = (await this._repository.update(props)).unmarshal();
    const updatedData = await this.findByRoleId(props.roleId);
    
    const getCachedData = await this._roleMenuPermissionCache.get(props.roleId);
    if (!Array.isArray(getCachedData)) {
      this._roleMenuPermissionCache.set(props.roleId, updatedData);
    }

    return updated;
  }
}
