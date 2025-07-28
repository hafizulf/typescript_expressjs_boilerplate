import container from "@/container";
import { injectable } from "inversify";
import { AnnouncementController } from "./announcement-controller";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import { Router } from "express";
import asyncWrap from "../common/asyncWrapper";

@injectable()
export class AnnouncementRoutes {
  public routes = "/announcements";
  controller = container.get<AnnouncementController>(AnnouncementController);
  AuthMiddleware = container.get<AuthMiddleware>(AuthMiddleware);

  public setRoutes(router: Router) {
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
  }
}
