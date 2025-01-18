import { IAuthRequest } from "@/presentation/middlewares/auth-interface";
import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { RoleService } from "./role-service";
import { Request, Response } from "express";
import {
  paginatedSchema,
  createRoleSchema,
  findOneRoleSchema,
  updateRoleSchema,
  deleteRoleSchema,
} from "./role-validation";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";

@injectable()
export class RoleController {
  constructor(
    @inject(TYPES.RoleService) private _service: RoleService
  ) {

  }
  public async findAll(req: Request, res: Response): Promise<Response> {
    const validatedReq = paginatedSchema.safeParse(req.query);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const [roles, pagination] = await this._service.findAll(validatedReq.data);
    return StandardResponse.create(res).setResponse({
      message: "Roles fetched successfully",
      status: HttpCode.OK,
      data: roles,
    }).withPagination(pagination?.omitProperties("offset")).send();
  }

  public async store(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = createRoleSchema.safeParse(req.body);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const role = await this._service.store({
      name: validatedReq.data.name,
      updatedBy: req.authUser.user.id,
    });
    return StandardResponse.create(res).setResponse({
      message: "Role created successfully",
      status: HttpCode.RESOURCE_CREATED,
      data: role,
    }).send();
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    const validatedReq = findOneRoleSchema.safeParse(req.params);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const role = await this._service.findById(validatedReq.data.id);
    return StandardResponse.create(res).setResponse({
      message: "Role fetched successfully",
      status: HttpCode.OK,
      data: role,
    }).send();
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const validatedReq = updateRoleSchema.safeParse({ ...req.params, ...req.body });
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }
    const { id, ...propsData } = validatedReq.data;
    const role = await this._service.update(id, propsData);

    return StandardResponse.create(res).setResponse({
      message: "Role updated successfully",
      status: HttpCode.OK,
      data: role,
    }).send();
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const validatedReq = deleteRoleSchema.safeParse(req.params);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    await this._service.delete(validatedReq.data.id);
    return StandardResponse.create(res).setResponse({
      message: "Role deleted successfully",
      status: HttpCode.OK,
    }).send();
  }
}
