import { injectable } from "inversify";
import container from "@/container";
import { Router } from "express";
import asyncWrap from "@/modules/common/asyncWrapper";
import { UserController } from "./user-controller";
import multer from "multer";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";

const tempUploadedFiles = multer({
  dest: "tmp/user/avatars",
})

@injectable()
export class UserRoutes {
  public routes = "/users";
  controller = container.get<UserController>(UserController);
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
      tempUploadedFiles.single("avatarPath"),
      asyncWrap(this.controller.store)
    )
    router.post(
      `${this.routes}/reset-password`,
      this.AuthMiddleware.authenticate,
      this.AuthMiddleware.roleAuthorize,
      asyncWrap(this.controller.resetPassword)
    )
    router.get(
      `${this.routes}/:id`,
      this.AuthMiddleware.authenticate,
      this.AuthMiddleware.roleAuthorize,
      asyncWrap(this.controller.findById)
    )
    router.put(
      `${this.routes}/change-password`,
      this.AuthMiddleware.authenticate,
      this.AuthMiddleware.roleAuthorize,
      asyncWrap(this.controller.changePassword)
    )
    router.put(
      `${this.routes}/:id`,
      this.AuthMiddleware.authenticate,
      this.AuthMiddleware.roleAuthorize,
      tempUploadedFiles.single("avatarPath"),
      asyncWrap( this.controller.update)
    )
    router.delete(
      `${this.routes}/:id`,
      this.AuthMiddleware.authenticate,
      this.AuthMiddleware.roleAuthorize,
      asyncWrap( this.controller.delete)
    )
  }
}
