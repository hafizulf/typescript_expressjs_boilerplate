import { HttpCode } from "@/exceptions/app-error";
import { inject, injectable } from "inversify";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";
import { MenuPermissionService } from "./menu-permission-service";
import { Request, Response } from "express";
import { StandardResponse } from "@/libs/standard-response";
import TYPES from "@/types";

@injectable()
export class MenuPermissionController {
  constructor(
    @inject(TYPES.MenuPermissionService) private _service: MenuPermissionService,
  ) {}

  public async findAll(_req: Request, res: Response): Promise<Response> {
    const data = await this._service.findAll();

    return StandardResponse.create(res).setResponse({
      message: "Menu permissions fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  public async seedMenuPermission(req: IAuthRequest, res: Response): Promise<Response> {
    await this._service.seedMenuPermission(req.authUser.user.id);
    return StandardResponse.create(res).setResponse({
      message: "Menu permissions seeded successfully",
      status: HttpCode.RESOURCE_CREATED,
    }).send();
  }
}
