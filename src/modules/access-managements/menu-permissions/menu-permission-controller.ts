import { AppError, HttpCode } from "@/exceptions/app-error";
import { createMenuPermissionSchema } from "./menu-permission-validation";
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

  public async findAllGroupByMenus(_req: Request, res: Response): Promise<Response> {
    const data = await this._service.findAllGroupByMenus();

    return StandardResponse.create(res).setResponse({
      message: "Menu permissions group by menus fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  public async store(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = createMenuPermissionSchema.safeParse(req.body);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const data = await this._service.store({ ...validatedReq.data, updatedBy: req.authUser.user.id });
    return StandardResponse.create(res).setResponse({
      message: "Menu permission created successfully",
      status: HttpCode.RESOURCE_CREATED,
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
