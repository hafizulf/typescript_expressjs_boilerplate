import { Router } from "express";
import { injectable } from "inversify";
import { AnnouncementRoutes } from "@/modules/announcements/announcement-routes";
import { MenuPermissionRoutes } from "@/modules/access-managements/menu-permissions/menu-permission-routes";
import { MenuRoutes } from "@/modules/access-managements/menus/menu-routes";
import { PermissionRoutes } from "@/modules/access-managements/permissions/permission-routes";
import { RoleMenuPermissionRoutes } from "@/modules/access-managements/role-menu-permissions/role-menu-permission-routes";
import { RoleRoutes } from "@/modules/roles/role-routes";
import { UserRoutes } from "@/modules/users/user-routes";
import { WebAuthRoutes } from "@/modules/authentications/web-auth-routes";
import { OriginRoutes } from "@/modules/origins/origin-routes";

@injectable()
export class Routes {
  constructor(
    private announcementRoutes: AnnouncementRoutes,
    private menuPermissionRoutes: MenuPermissionRoutes,
    private menuRoutes: MenuRoutes,
    private originRoutes: OriginRoutes,
    private permissionRoutes: PermissionRoutes,
    private roleMenuPermissionRoutes: RoleMenuPermissionRoutes,
    private roleRoutes: RoleRoutes,
    private userRoutes: UserRoutes,
    private webAuthRoutes: WebAuthRoutes,
  ) {}

  public setRoutes(router: Router) {
    this.announcementRoutes.setRoutes(router);
    this.menuPermissionRoutes.setRoutes(router);
    this.menuRoutes.setRoutes(router);
    this.originRoutes.setRoutes(router);
    this.permissionRoutes.setRoutes(router);
    this.roleMenuPermissionRoutes.setRoutes(router);
    this.roleRoutes.setRoutes(router);
    this.userRoutes.setRoutes(router);
    this.webAuthRoutes.setRoutes(router);
  }
}
