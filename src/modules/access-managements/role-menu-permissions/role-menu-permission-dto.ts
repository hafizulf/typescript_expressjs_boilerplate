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

export interface TPropsBulkUpdateRoleMenuPermission {
  roleId: string;
  menus: {
    menuId: string;
    permissionList: {
      permissionId: string;
      isPermitted: boolean;
    }[];
  }[];
}

export interface TPropsCreateRoleMenuPermission {
  roleId: string;
  menuId: string;
  permissionId: string;
  updatedBy: string;
}
