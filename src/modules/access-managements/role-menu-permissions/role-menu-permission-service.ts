import { inject, injectable } from "inversify";
import { IRoleMenuPermission } from "./role-menu-permission-domain";
import { IRoleMenuPermissionRepository } from "./role-menu-permission-repository-interface";
import {
  RoleMenuPermissionDto,
  TPropsBulkUpdateRoleMenuPermission,
  TPropsCreateRoleMenuPermission
} from "./role-menu-permission-dto";
import TYPES from "@/types";
import { RedisClient } from "@/libs/redis/redis-client";
import { getRoleMenuPermissionsKey } from "@/helpers/redis-keys";
import { JWT_SECRET_TTL } from "@/config/env";

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
    this._updateRoleMenuPermissionCache(data.roleId, updatedData);

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
    
    await this._updateRoleMenuPermissionCache(props.roleId, updatedData);

    return updated;
  }

  private async _updateRoleMenuPermissionCache(
    roleId: string, 
    updatedData: RoleMenuPermissionDto | []
  ): Promise<void> {
    const userRoleMenuPermissionKey = getRoleMenuPermissionsKey(roleId);
    await RedisClient.set(userRoleMenuPermissionKey, JSON.stringify(updatedData), JWT_SECRET_TTL);
  }
}
