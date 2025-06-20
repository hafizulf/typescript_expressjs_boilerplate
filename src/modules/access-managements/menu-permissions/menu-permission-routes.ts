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
      `${this.routes}/enabled-list`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.findEnabledList.bind(this.controller))
    );
    router.get(
      `${this.routes}/group-by-menus`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.findAllGroupByMenus.bind(this.controller))
    );
    router.get(
      this.routes,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.findAll.bind(this.controller))
    );
    router.post(
      this.routes,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.store.bind(this.controller))
    )
    router.get(
      `${this.routes}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.findById.bind(this.controller))
    );
    router.put(
      `${this.routes}/bulk-update`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.bulkUpdate.bind(this.controller))
    );
    router.put(
      `${this.routes}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.update.bind(this.controller))
    );
    router.delete(
      `${this.routes}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.delete.bind(this.controller))
    );
    router.post(
      `${this.routes}/seeds`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.seedMenuPermission.bind(this.controller))
    );
  }
}
