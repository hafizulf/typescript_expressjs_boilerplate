import asyncWrap from "@/modules/common/asyncWrapper";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import container from "@/container";
import { injectable } from "inversify";
import { RoleMenuPermissionController } from "./role-menu-permission-controller";
import { Router } from "express";
import { SUPERADMIN } from "@/modules/common/const/role-constants";

@injectable()
export class RoleMenuPermissionRoutes {
  public routes = "/role-menu-permissions";
  private controller = container.get<RoleMenuPermissionController>(RoleMenuPermissionController);
  private authMiddleware = container.get<AuthMiddleware>(AuthMiddleware);

  public setRoutes(router: Router) {
    router.get(
      `${this.routes}/:roleId`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.findByRoleId.bind(this.controller))
    );
    router.put(
      `${this.routes}/bulk-update/:roleId`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.bulkUpdate.bind(this.controller))
    );
    router.post(
      this.routes,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.store.bind(this.controller))
    );
    router.put(
      `${this.routes}/:roleId`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.update.bind(this.controller))
    );
  }
}
