import container from "@/container";
import { Router } from "express";
import { injectable } from "inversify";
import asyncWrap from "@/modules/common/asyncWrapper";
import { RoleController } from "./role-controller";

@injectable()
export class RoleRoutes {
  public routes = "/roles";
  controller = container.get<RoleController>(RoleController);

  public setRoutes(router: Router) {
    router.get(
      this.routes,
      asyncWrap(
        this.controller.findAll.bind(this.controller)
      )
    )
    router.post(
      this.routes,
      asyncWrap(this.controller.store.bind(this.controller))
    )
    router.get(
      `${this.routes}/:id`,
      asyncWrap(this.controller.findById.bind(this.controller))
    )
    router.put(
      `${this.routes}/:id`,
      asyncWrap(this.controller.update.bind(this.controller))
    )
    router.delete(
      `${this.routes}/:id`,
      asyncWrap(this.controller.delete.bind(this.controller))
    )
  }
}
