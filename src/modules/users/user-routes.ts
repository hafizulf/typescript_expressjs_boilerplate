import { injectable } from "inversify";
import container from "@/container";
import { Router } from "express";
import asyncWrap from "@/modules/common/asyncWrapper";
import { UserController } from "./user-controller";
import multer from "multer";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import { ADMIN, SUPERADMIN, USER } from "../common/const/role-constants";

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
      this.AuthMiddleware.authenticate.bind(this.AuthMiddleware),
      this.AuthMiddleware.roleAuthorize([SUPERADMIN, ADMIN]),
      asyncWrap(
        this.controller.findAll.bind(this.controller)
      )
    )
    router.post(
      this.routes,
      this.AuthMiddleware.authenticate.bind(this.AuthMiddleware),
      this.AuthMiddleware.roleAuthorize([SUPERADMIN]),
      tempUploadedFiles.single("avatarPath"),
      asyncWrap(
        this.controller.store.bind(this.controller)
      )
    )
    router.post(
      `${this.routes}/reset-password`,
      this.AuthMiddleware.authenticate.bind(this.AuthMiddleware),
      this.AuthMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(
        this.controller.resetPassword.bind(this.controller)
      )
    )
    router.get(
      `${this.routes}/:id`,
      this.AuthMiddleware.authenticate.bind(this.AuthMiddleware),
      this.AuthMiddleware.roleAuthorize([SUPERADMIN, ADMIN, USER]),
      asyncWrap(
        this.controller.findById.bind(this.controller)
      )
    )
    router.put(
      `${this.routes}/change-password`,
      this.AuthMiddleware.authenticate.bind(this.AuthMiddleware),
      this.AuthMiddleware.roleAuthorize([SUPERADMIN, ADMIN, USER]),
      asyncWrap(
        this.controller.changePassword.bind(this.controller)
      )
    )
    router.put(
      `${this.routes}/:id`,
      this.AuthMiddleware.authenticate.bind(this.AuthMiddleware),
      this.AuthMiddleware.roleAuthorize([SUPERADMIN, ADMIN, USER]),
      tempUploadedFiles.single("avatarPath"),
      asyncWrap(
        this.controller.update.bind(this.controller)
      )
    )
    router.delete(
      `${this.routes}/:id`,
      this.AuthMiddleware.authenticate.bind(this.AuthMiddleware),
      this.AuthMiddleware.roleAuthorize([SUPERADMIN]),
      asyncWrap(
        this.controller.delete.bind(this.controller)
      )
    )
  }
}
