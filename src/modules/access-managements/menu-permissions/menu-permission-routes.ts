import asyncWrap from "@/modules/common/asyncWrapper";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import container from "@/container";
import { injectable } from "inversify";
import { MenuPermissionController } from "./menu-permission-controller";
import { Router } from "express";
import { SUPERADMIN } from "@/modules/common/const/role-constants";

@injectable()
export class MenuPermissionRoutes {
  public routes = "/menu-permissions";
  private controller = container.get<MenuPermissionController>(MenuPermissionController);
  private authMiddleware = container.get<AuthMiddleware>(AuthMiddleware);

  public setRoutes(router: Router) {
    router.get(
      this.routes,
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.findAll.bind(this.controller))
    );
    router.post(
      `${this.routes}/seeds`,
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.seedMenuPermission.bind(this.controller))
    );
  }
}
