import container from "@/container";
import { injectable } from "inversify";
import { AnnouncementController } from "./announcement-controller";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import { Router } from "express";
import asyncWrap from "../common/asyncWrapper";
import { SUPERADMIN, ADMIN, USER } from "../common/const/role-constants";

@injectable()
export class AnnouncementRoutes {
  public routes = "/announcements";
  controller = container.get<AnnouncementController>(AnnouncementController);
  AuthMiddleware = container.get<AuthMiddleware>(AuthMiddleware);

  public setRoutes(router: Router) {
    router.post(
      this.routes,
      this.AuthMiddleware.authenticate,
      this.AuthMiddleware.roleAuthorize([SUPERADMIN, ADMIN]),
      asyncWrap(this.controller.store.bind(this.controller))
    )

    router.get(
      `${this.routes}/:id`,
      this.AuthMiddleware.authenticate,
      this.AuthMiddleware.roleAuthorize([SUPERADMIN, ADMIN, USER]),
      asyncWrap(this.controller.findById.bind(this.controller))
    )
  }
}
