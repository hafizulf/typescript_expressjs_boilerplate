export interface PermissionInRoleMenuPermission {
  permissionId: string;
  permission: string;
  isPermitted: boolean;
}

export interface MenuInRoleMenuPermission {
  menuId: string;
  menu: string;
  permissionList: PermissionInRoleMenuPermission[];
}

export interface RoleMenuPermissionDto {
  roleId: string;
  role: string;
  menus: MenuInRoleMenuPermission[];
}
