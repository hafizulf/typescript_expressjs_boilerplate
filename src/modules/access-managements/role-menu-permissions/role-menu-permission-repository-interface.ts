import { RoleMenuPermissionDto } from "./role-menu-permission-dto";

export interface IRoleMenuPermissionRepository {
  findByRoleId(roleId: string): Promise<RoleMenuPermissionDto | []>;
}
