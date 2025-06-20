import asyncWrap from "@/modules/common/asyncWrapper";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import container from "@/container";
import { injectable } from "inversify";
import { MenuController } from "./menu-controller";
import { Router } from "express";
import { SUPERADMIN } from "@/modules/common/const/role-constants";

@injectable()
export class MenuRoutes {
  public routes = "/menus";
  private controller = container.get<MenuController>(MenuController);
  private authMiddleware = container.get<AuthMiddleware>(AuthMiddleware);

  public setRoutes(router: Router) {
    router.get(
      this.routes,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.findAll)
    );
    router.get(
      `${this.routes}/parents`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.findAllParents)
    );
    router.get(
      `${this.routes}/childs/:parentId`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.findChildsByParentId)
    );
    router.post(
      this.routes,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.store)
    );
    router.get(
      `${this.routes}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.findById)
    );
    router.put(
      `${this.routes}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.update)
    );
    router.delete(
      `${this.routes}/:id`,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.delete)
    )
  }
}
