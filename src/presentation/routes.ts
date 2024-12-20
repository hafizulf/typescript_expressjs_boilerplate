import { injectable } from "inversify";
import { Router } from "express";
import { AnnouncementRoutes } from "@/modules/announcements/announcement-routes";
import { UserRoutes } from "@/modules/users/user-routes";
import { RoleRoutes } from "@/modules/roles/role-routes";
import { WebAuthRoutes } from "@/modules/authentications/web-auth-routes";

@injectable()
export class Routes {
  constructor(
    private webAuthRoutes: WebAuthRoutes,
    private userRoutes: UserRoutes,
    private roleRoutes: RoleRoutes,
    private announcementRoutes: AnnouncementRoutes,
  ) {}

  public setRoutes(router: Router) {
    this.webAuthRoutes.setRoutes(router);
    this.userRoutes.setRoutes(router);
    this.roleRoutes.setRoutes(router);
    this.announcementRoutes.setRoutes(router);
  }
}
