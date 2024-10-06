import container from "@/container";
import { injectable } from "inversify";
import { WebAuthController } from "./web-auth-controller";
import { Router } from "express";
import asyncWrap from "../common/asyncWrapper";

@injectable()
export class WebAuthRoutes {
  public routes = "/auths";
  controller = container.get<WebAuthController>(WebAuthController);

  public setRoutes(router: Router) {
    router.post(
      `${this.routes}/login`,
      asyncWrap(this.controller.login.bind(this.controller))
    )
    router.get(
      `${this.routes}/getMe`,
      asyncWrap(this.controller.getMe.bind(this.controller))
    )
  }
}
