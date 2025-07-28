import container from "@/container";
import { injectable } from "inversify";
import { WebAuthController } from "./web-auth-controller";
import { Router } from "express";
import asyncWrap from "../common/asyncWrapper";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";

@injectable()
export class WebAuthRoutes {
  public routes = "/auths";
  controller = container.get<WebAuthController>(WebAuthController);
  AuthMiddleware = container.get<AuthMiddleware>(AuthMiddleware);

  public setRoutes(router: Router) {
    router.post(
      `${this.routes}/login`,
      asyncWrap(this.controller.login)
    )
    router.get(
      `${this.routes}/getMe`,
      this.AuthMiddleware.authenticate,
      asyncWrap(this.controller.getMe)
    )
    router.post(
      `${this.routes}/refresh-token`,
      asyncWrap(this.controller.generateAccessToken)
    )
    router.post(
      `${this.routes}/refresh-token/revoke/:userId`,
      this.AuthMiddleware.authenticate,
      asyncWrap(this.controller.revokeRefreshToken)
    )
    router.post(
      `${this.routes}/logout`,
      this.AuthMiddleware.authenticate,
      this.AuthMiddleware.roleAuthorize,
      asyncWrap(this.controller.logout)
    )
  }
}
