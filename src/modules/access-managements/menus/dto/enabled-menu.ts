import { TPermissionList } from "@/modules/access-managements/permissions/dto/permission-list";

interface IEnabledMenu {
  [key: string]: TPermissionList[];
}

export const ENABLED_MENU: IEnabledMenu = {
  ROLE: ["READ", "CREATE", "UPDATE", "DELETE"],
  USER: ["READ", "CREATE", "UPDATE", "DELETE"],
  MENU: ["READ", "CREATE", "UPDATE", "DELETE"],
  PERMISSION: ["READ", "CREATE", "UPDATE", "DELETE"],
  MENU_PERMISSION: ["READ", "CREATE", "UPDATE", "DELETE", "BULK UPDATE"],
  ROLE_MENU_PERMISSION: ["READ", "CREATE", "UPDATE", "BULK UPDATE"],
}

export const REQUEST_PERMISSIONS: Record<'GET' | 'POST' | 'PUT' | 'DELETE', string[]> = {
  GET: ['READ'],
  POST: ['CREATE'],
  PUT: ['UPDATE', 'BULK UPDATE'],
  DELETE: ['DELETE'],
}
