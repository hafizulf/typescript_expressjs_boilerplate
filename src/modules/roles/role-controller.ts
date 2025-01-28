import { HttpCode } from "@/exceptions/app-error";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";
import { inject, injectable } from "inversify";
import { RoleService } from "./role-service";
import { Request, Response } from "express";
import {
  paginatedRoleSchema,
  createRoleSchema,
  findOneRoleSchema,
  updateRoleSchema,
  deleteRoleSchema,
} from './role-validation';
import { StandardResponse } from "@/libs/standard-response";
import TYPES from "@/types";
import { validateSchema } from "@/helpers/schema-validator";

@injectable()
export class RoleController {
  constructor(
    @inject(TYPES.RoleService) private _service: RoleService
  ) {

  }
  public async findAll(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(paginatedRoleSchema, req.query);
    const [roles, pagination] = await this._service.findAll(validatedReq);

    return StandardResponse.create(res).setResponse({
      message: "Roles fetched successfully",
      status: HttpCode.OK,
      data: roles,
    }).withPagination(pagination?.omitProperties("offset")).send();
  }

  public async store(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = validateSchema(createRoleSchema, req.body);
    const role = await this._service.store({
      name: validatedReq.name,
      updatedBy: req.authUser.user.id,
    });

    return StandardResponse.create(res).setResponse({
      message: "Role created successfully",
      status: HttpCode.RESOURCE_CREATED,
      data: role,
    }).send();
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(findOneRoleSchema, req.params);
    const role = await this._service.findById(validatedReq.id);

    return StandardResponse.create(res).setResponse({
      message: "Role fetched successfully",
      status: HttpCode.OK,
      data: role,
    }).send();
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(updateRoleSchema, { ...req.params, ...req.body });
    const { id, ...propsData } = validatedReq;
    const role = await this._service.update(id, propsData);

    return StandardResponse.create(res).setResponse({
      message: "Role updated successfully",
      status: HttpCode.OK,
      data: role,
    }).send();
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(deleteRoleSchema, req.params);

    await this._service.delete(validatedReq.id);
    return StandardResponse.create(res).setResponse({
      message: "Role deleted successfully",
      status: HttpCode.OK,
    }).send();
  }
}
