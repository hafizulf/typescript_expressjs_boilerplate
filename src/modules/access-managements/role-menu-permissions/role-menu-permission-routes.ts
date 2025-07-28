import asyncWrap from "@/modules/common/asyncWrapper";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import container from "@/container";
import { injectable } from "inversify";
import { RoleMenuPermissionController } from "./role-menu-permission-controller";
import { Router } from "express";

@injectable()
export class RoleMenuPermissionRoutes {
  public routes = "/role-menu-permissions";
  private controller = container.get<RoleMenuPermissionController>(RoleMenuPermissionController);
  private authMiddleware = container.get<AuthMiddleware>(AuthMiddleware);

  public setRoutes(router: Router) {
    router.get(
      `${this.routes}/:roleId`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize,
      asyncWrap(this.controller.findByRoleId)
    );
    router.put(
      `${this.routes}/bulk-update/:roleId`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize,
      asyncWrap(this.controller.bulkUpdate)
    );
    router.post(
      this.routes,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize,
      asyncWrap(this.controller.store)
    );
    router.put(
      `${this.routes}/:roleId`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize,
      asyncWrap(this.controller.update)
    );
  }
}
