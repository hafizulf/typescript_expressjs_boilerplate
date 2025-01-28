import { HttpCode } from "@/exceptions/app-error";
import { createPermissionSchema, deletePermissionSchema, findPermissionByIdSchema, updatePermissionSchema } from "./permission-validation";
import { inject, injectable } from "inversify";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";
import { PermissionService } from "./permission-service";
import { Request, Response } from "express";
import { StandardResponse } from "@/libs/standard-response";
import TYPES from "@/types";
import { validateSchema } from "@/helpers/schema-validator";

@injectable()
export class PermissionController {
  constructor(
    @inject(TYPES.PermissionService) private _service: PermissionService,
  ) {}

  public async findAll(_req: Request, res: Response): Promise<Response> {
    const data = await this._service.findAll();

    return StandardResponse.create(res).setResponse({
      message: "Permissions fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  public async store(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = validateSchema(createPermissionSchema, req.body);
    const data = await this._service.store({
      ...validatedReq,
      updatedBy: req.authUser.user.id,
    });

    return StandardResponse.create(res).setResponse({
      message: "Permission created successfully",
      status: HttpCode.RESOURCE_CREATED,
      data,
    }).send();
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(findPermissionByIdSchema, req.params);
    const data = await this._service.findById(validatedReq.id);

    return StandardResponse.create(res).setResponse({
      message: "Permission fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  async update(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = validateSchema(updatePermissionSchema, {
      ...req.params,
      ...req.body,
    });
    const { id, ...propsData } = validatedReq;
    const data = await this._service.update(id, {
      ...propsData,
      updatedBy: req.authUser.user.id,
    });

    return StandardResponse.create(res).setResponse({
      message: "Permission updated successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(deletePermissionSchema, req.params);
    await this._service.delete(validatedReq.id);

    return StandardResponse.create(res).setResponse({
      message: "Permission deleted successfully",
      status: HttpCode.OK,
    }).send();
  }
}
