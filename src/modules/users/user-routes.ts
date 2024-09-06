import { injectable } from "inversify";
import container from "@/container";
import { Router } from "express";
import asyncWrap from "@/modules/common/asyncWrapper";
import { UserController } from "./user-controller";
import multer from "multer";

const tempUploadedFiles = multer({
  dest: "tmp/user/avatars",
})

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
    router.post(
      this.routes,
      tempUploadedFiles.single("avatarPath"),
      asyncWrap(
        this.controller.store.bind(this.controller)
      )
    )
    router.get(
      `${this.routes}/:id`,
      asyncWrap(
        this.controller.findById.bind(this.controller)
      )
    )
    router.put(
      `${this.routes}/:id`,
      tempUploadedFiles.single("avatarPath"),
      asyncWrap(
        this.controller.update.bind(this.controller)
      )
    )
    router.delete(
      `${this.routes}/:id`,
      asyncWrap(
        this.controller.delete.bind(this.controller)
      )
    )
  }
}
