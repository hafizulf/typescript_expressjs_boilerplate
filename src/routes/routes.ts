import { injectable } from "inversify";
import { UserRoutes } from "@/modules/users/user-routes";
import { Router } from "express";

@injectable()
export class Routes {
  constructor(
    private userRoutes: UserRoutes,
  ) {}

  public setRoutes(router: Router) {
    this.userRoutes.setRoutes(router);
  }
}
