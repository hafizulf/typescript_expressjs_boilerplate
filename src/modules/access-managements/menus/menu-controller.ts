import { HttpCode } from "@/exceptions/app-error";
import { createMenuSchema, deleteMenuSchema, findChildsByParentIdSchema, findMenuByIdSchema, updateMenuSchema } from "./menu-validation";
import { inject, injectable } from "inversify";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";
import { MenuService } from "./menu-service";
import { Request, Response } from "express";
import { StandardResponse } from "@/libs/standard-response";
import TYPES from "@/types";
import { validateSchema } from "@/helpers/schema-validator";

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

  public async findAllParents(_req: Request, res: Response): Promise<Response> {
    const menus = await this._service.findAllParents();

    return StandardResponse.create(res).setResponse({
      message: "Parent menus fetched successfully",
      status: HttpCode.OK,
      data: menus,
    }).send();
  }

  public async findChildsByParentId(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(findChildsByParentIdSchema, req.params);
    const menus = await this._service.findChildsByParentId(validatedReq.parentId);

    return StandardResponse.create(res).setResponse({
      message: "Child menus fetched successfully",
      status: HttpCode.OK,
      data: menus,
    }).send();
  }

  public async store(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = validateSchema(createMenuSchema, req.body);
    const menu = await this._service.store({
      ...validatedReq,
      updatedBy: req.authUser.user.id,
    });

    return StandardResponse.create(res).setResponse({
      message: "Menu created successfully",
      status: HttpCode.RESOURCE_CREATED,
      data: menu,
    }).send();
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(findMenuByIdSchema, req.params);
    const data = await this._service.findById(validatedReq.id);

    return StandardResponse.create(res).setResponse({
      message: "Menu fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  async update(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = validateSchema(updateMenuSchema, {
      ...req.params,
      ...req.body,
    });
    const { id, ...propsData } = validatedReq;
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
    const validatedReq = validateSchema(deleteMenuSchema, req.params);

    await this._service.delete(validatedReq.id);

    return StandardResponse.create(res).setResponse({
      message: "Menu deleted successfully",
      status: HttpCode.OK,
    }).send();
  }
}
