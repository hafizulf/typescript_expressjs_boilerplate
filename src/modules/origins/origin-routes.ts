import container from "@/container";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import { injectable } from "inversify";
import { OriginController } from "./origin-controller";
import { Router } from "express";
import asyncWrap from "../common/asyncWrapper";
import { SUPERADMIN } from "../common/const/role-constants";

@injectable()
export class OriginRoutes { 
  public routes = '/origins'
  authMiddleware = container.get<AuthMiddleware>(AuthMiddleware);
  controller = container.get<OriginController>(OriginController);

  public setRoutes(router: Router) {
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
    router.get(
      this.routes,
      this.authMiddleware.authenticate,
      this.authMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.findAll)
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
    );
  }
}
