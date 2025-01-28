import { IRoleMenuPermission } from "./role-menu-permission-domain";
import { RoleMenuPermissionDto } from "./role-menu-permission-dto";

export interface IRoleMenuPermissionRepository {
  findByRoleId(roleId: string): Promise<RoleMenuPermissionDto | []>;
  bulkUpdate(props: IRoleMenuPermission[]): void;
}
