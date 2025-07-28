import asyncWrap from "@/modules/common/asyncWrapper";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import container from "@/container";
import { injectable } from "inversify";
import { PermissionController } from "./permission-controller";
import { Router } from "express";

@injectable()
export class PermissionRoutes {
  public routes = "/permissions";
  private controller = container.get<PermissionController>(PermissionController);
  private authMiddleware = container.get<AuthMiddleware>(AuthMiddleware);

  public setRoutes(router: Router) {
    router.get(
      this.routes,
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      this.authMiddleware.roleAuthorize,
      asyncWrap(this.controller.findAll.bind(this.controller))
    );
    router.post(
      this.routes,
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      this.authMiddleware.roleAuthorize,
      asyncWrap(this.controller.store.bind(this.controller))
    );
    router.get(
      `${this.routes}/:id`,
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      this.authMiddleware.roleAuthorize,
      asyncWrap(this.controller.findById.bind(this.controller))
    );
    router.put(
      `${this.routes}/:id`,
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      this.authMiddleware.roleAuthorize,
      asyncWrap(this.controller.update.bind(this.controller))
    );
    router.delete(
      `${this.routes}/:id`,
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      this.authMiddleware.roleAuthorize,
      asyncWrap(this.controller.delete.bind(this.controller))
    )
  }
}
