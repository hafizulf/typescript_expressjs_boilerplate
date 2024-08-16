import { injectable } from "inversify";
import { Router } from "express";
import { UserRoutes } from "@/modules/users/user-routes";
import { RoleRoutes } from "@/modules/roles/role-routes";

@injectable()
export class Routes {
  constructor(
    private userRoutes: UserRoutes,
    private roleRoutes: RoleRoutes,
  ) {}

  public setRoutes(router: Router) {
    this.userRoutes.setRoutes(router);
    this.roleRoutes.setRoutes(router);
  }
}
