import container from "@/container";
import { Router } from "express";
import { injectable } from "inversify";
import asyncWrap from "@/modules/common/asyncWrapper";
import { RoleController } from "./role-controller";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";

@injectable()
export class RoleRoutes {
  public routes = "/roles";
  controller = container.get<RoleController>(RoleController);
  AuthMiddleware = container.get<AuthMiddleware>(AuthMiddleware);

  public setRoutes(router: Router) {
    router.get(
      this.routes,
      this.AuthMiddleware.authenticate,
      this.AuthMiddleware.roleAuthorize,
      asyncWrap(this.controller.findAll)
    )
    router.post(
      this.routes,
      this.AuthMiddleware.authenticate,
      this.AuthMiddleware.roleAuthorize,
      asyncWrap(this.controller.store)
    )
    router.get(
      `${this.routes}/:id`,
      this.AuthMiddleware.authenticate,
      this.AuthMiddleware.roleAuthorize,
      asyncWrap(this.controller.findById)
    )
    router.put(
      `${this.routes}/:id`,
      this.AuthMiddleware.authenticate,
      this.AuthMiddleware.roleAuthorize,
      asyncWrap(this.controller.update)
    )
    router.delete(
      `${this.routes}/:id`,
      this.AuthMiddleware.authenticate,
      this.AuthMiddleware.roleAuthorize,
      asyncWrap(this.controller.delete)
    )
  }
}
