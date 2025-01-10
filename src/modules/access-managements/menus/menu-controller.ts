import { AppError, HttpCode } from "@/exceptions/app-error";
import { createMenuSchema, deleteMenuSchema, findMenuByIdSchema, updateMenuSchema } from "./menu-validation";
import { inject, injectable } from "inversify";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";
import { MenuService } from "./menu-service";
import { Request, Response } from "express";
import { StandardResponse } from "@/libs/standard-response";
import TYPES from "@/types";

@injectable()
export class MenuController {
  constructor(
    @inject(TYPES.MenuService) private _service: MenuService,
  ) {}

  public async findAll(_req: Request, res: Response): Promise<Response> {
    const menus = await this._service.findAll();

    return StandardResponse.create(res).setResponse({
      message: "Menus fetched successfully",
      status: HttpCode.OK,
      data: menus,
    }).send();
  }

  public async store(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = createMenuSchema.safeParse(req.body);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const menu = await this._service.store({
      ...validatedReq.data,
      updatedBy: req.authUser.user.id,
    });
    return StandardResponse.create(res).setResponse({
      message: "Menu created successfully",
      status: HttpCode.RESOURCE_CREATED,
      data: menu,
    }).send();
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const validatedReq = findMenuByIdSchema.safeParse(req.params);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const data = await this._service.findById(validatedReq.data.id);
    return StandardResponse.create(res).setResponse({
      message: "Menu fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  async update(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = updateMenuSchema.safeParse({ ...req.params, ...req.body });
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const { id, ...propsData } = validatedReq.data;
    const data = await this._service.update(id, {
      ...propsData,
      updatedBy: req.authUser.user.id,
    });

    return StandardResponse.create(res).setResponse({
      message: "Menu updated successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const validatedReq = deleteMenuSchema.safeParse(req.params);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    await this._service.delete(validatedReq.data.id);
    return StandardResponse.create(res).setResponse({
      message: "Menu deleted successfully",
      status: HttpCode.OK,
    }).send();
  }
}
