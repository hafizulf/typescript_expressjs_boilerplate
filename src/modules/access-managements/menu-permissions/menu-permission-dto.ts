import { IMenuPermission } from "./menu-permission-domain";

export interface ResponseFindAllMenuPermissions
  extends Omit<IMenuPermission, 'menu' | 'permission' | 'updatedAt' | 'deletedAt'> {
  menu: string;
  permission: string;
}
interface PermissionDetails {
  permissionId: string;
  permission: string;
  isEnabled: boolean;
}

export interface ListPermissionsByMenu {
  menuId: string;
  menu: string;
  permissionList: PermissionDetails[];
  createdAt: Date;
}

interface IPermissionUpdate {
  permissionId: string;
  isEnabled: boolean;
}

export interface TPropsBulkUpdateMenuPermissions {
  menuId: string;
  permissionList: IPermissionUpdate[];
}
