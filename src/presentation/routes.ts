import { Router } from "express";
import { injectable } from "inversify";
import { AnnouncementRoutes } from "@/modules/announcements/announcement-routes";
import { MenuPermissionRoutes } from "@/modules/access-managements/menu-permissions/menu-permission-routes";
import { MenuRoutes } from "@/modules/access-managements/menus/menu-routes";
import { PermissionRoutes } from "@/modules/access-managements/permissions/permission-routes";
import { RoleRoutes } from "@/modules/roles/role-routes";
import { UserRoutes } from "@/modules/users/user-routes";
import { WebAuthRoutes } from "@/modules/authentications/web-auth-routes";

@injectable()
export class Routes {
  constructor(
    private announcementRoutes: AnnouncementRoutes,
    private menuPermissionRoutes: MenuPermissionRoutes,
    private menuRoutes: MenuRoutes,
    private permissionRoutes: PermissionRoutes,
    private roleRoutes: RoleRoutes,
    private userRoutes: UserRoutes,
    private webAuthRoutes: WebAuthRoutes,
  ) {}

  public setRoutes(router: Router) {
    this.announcementRoutes.setRoutes(router);
    this.menuPermissionRoutes.setRoutes(router);
    this.menuRoutes.setRoutes(router);
    this.permissionRoutes.setRoutes(router);
    this.roleRoutes.setRoutes(router);
    this.userRoutes.setRoutes(router);
    this.webAuthRoutes.setRoutes(router);
  }
}
