import { injectable } from "inversify";
import container from "@/container";
import { Router } from "express";
import asyncWrap from "@/modules/common/asyncWrapper";
import { UserController } from "./user-controller";

@injectable()
export class UserRoutes {
  public routes = "/users";
  controller = container.get<UserController>(UserController);

  public setRoutes(router: Router) {
    router.get(
      this.routes,
      asyncWrap(
        this.controller.findAll.bind(this.controller)
      )
    )
  }
}
