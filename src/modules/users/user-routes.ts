import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class UserRoutes {
  public routes = "/users";
  // controller

  public setRoutes(router: Router) {
    router.get(
      this.routes,
      (_req, res) => {
        return res.send("Hello User Routes!");
      }
    )
  }
}
