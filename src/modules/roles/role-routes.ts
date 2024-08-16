import container from "@/container";
import { Router } from "express";
import { injectable } from "inversify";
import asyncWrap from "@/modules/common/asyncWrapper";
import { RoleController } from "./role-controller";

@injectable()
export class RoleRoutes {
  public routes = "/roles";
  RoleController = container.get<RoleController>(RoleController);

  public setRoutes(router: Router) {
    router.get(
      this.routes,
      asyncWrap(
        this.RoleController.findAll.bind(this.RoleController)
      )
    )
  }
}
