import container from "@/container";
import { Router } from "express";
import { injectable } from "inversify";
import asyncWrap from "@/modules/common/asyncWrapper";
import { RoleController } from "./role-controller";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import { SUPERADMIN } from "../common/const/role-constants";

@injectable()
export class RoleRoutes {
  public routes = "/roles";
  controller = container.get<RoleController>(RoleController);
  AuthMiddleware = container.get<AuthMiddleware>(AuthMiddleware);

  public setRoutes(router: Router) {
    router.get(
      this.routes,
      this.AuthMiddleware.authenticate.bind(this.AuthMiddleware),
      this.AuthMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(
        this.controller.findAll.bind(this.controller)
      )
    )
    router.post(
      this.routes,
      this.AuthMiddleware.authenticate.bind(this.AuthMiddleware),
      this.AuthMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.store.bind(this.controller))
    )
    router.get(
      `${this.routes}/:id`,
      this.AuthMiddleware.authenticate.bind(this.AuthMiddleware),
      this.AuthMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.findById.bind(this.controller))
    )
    router.put(
      `${this.routes}/:id`,
      this.AuthMiddleware.authenticate.bind(this.AuthMiddleware),
      this.AuthMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.update.bind(this.controller))
    )
    router.delete(
      `${this.routes}/:id`,
      this.AuthMiddleware.authenticate.bind(this.AuthMiddleware),
      this.AuthMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(this.controller.delete.bind(this.controller))
    )
  }
}
