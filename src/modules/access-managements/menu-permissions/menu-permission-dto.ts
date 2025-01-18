interface PermissionDetails {
  permissionId: string;
  permission: string;
  isEnabled: boolean;
}

export interface ListPermissionsByMenu {
  menuId: string;
  menu: string;
  permissionList: PermissionDetails[];
}
