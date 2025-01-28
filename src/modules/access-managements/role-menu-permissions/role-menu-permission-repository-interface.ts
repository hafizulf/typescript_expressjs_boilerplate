import { IRoleMenuPermission, RoleMenuPermissionDomain } from "./role-menu-permission-domain";
import { RoleMenuPermissionDto, TPropsCreateRoleMenuPermission } from "./role-menu-permission-dto";

export interface IRoleMenuPermissionRepository {
  findByRoleId(roleId: string): Promise<RoleMenuPermissionDto | []>;
  bulkUpdate(props: IRoleMenuPermission[]): void;
  store(props: TPropsCreateRoleMenuPermission): Promise<RoleMenuPermissionDomain>;
  update(props: IRoleMenuPermission): Promise<RoleMenuPermissionDomain>;
}
