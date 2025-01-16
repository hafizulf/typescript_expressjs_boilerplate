import { TPermissionList } from "@/modules/access-managements/permissions/dto/permission-list";

interface IEnabledMenu {
  [key: string]: TPermissionList[];
}

export const ENABLED_MENU: IEnabledMenu = {
  ROLE_MANAGEMENT: ["READ", "CREATE", "UPDATE", "DELETE"],
  USER_MANAGEMENT: ["READ", "CREATE", "UPDATE", "DELETE"],
  MENU: ["READ", "CREATE", "UPDATE", "DELETE"],
  PERMISSION: ["READ", "CREATE", "UPDATE", "DELETE"],
  ROLE_MENU_PERMISSION: ["READ", "UPDATE"],
}
