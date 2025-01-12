import { AppError, HttpCode } from "@/exceptions/app-error";
import { createPermissionSchema, deletePermissionSchema, findPermissionByIdSchema, updatePermissionSchema } from "./permission-validation";
import { inject, injectable } from "inversify";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";
import { PermissionService } from "./permission-service";
import { Request, Response } from "express";
import { StandardResponse } from "@/libs/standard-response";
import TYPES from "@/types";

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
    const validatedReq = createPermissionSchema.safeParse(req.body);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const data = await this._service.store({
      ...validatedReq.data,
      updatedBy: req.authUser.user.id,
    });
    return StandardResponse.create(res).setResponse({
      message: "Permission created successfully",
      status: HttpCode.RESOURCE_CREATED,
      data,
    }).send();
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const validatedReq = findPermissionByIdSchema.safeParse(req.params);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const data = await this._service.findById(validatedReq.data.id);
    return StandardResponse.create(res).setResponse({
      message: "Permission fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  async update(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = updatePermissionSchema.safeParse({ ...req.params, ...req.body });
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
      message: "Permission updated successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const validatedReq = deletePermissionSchema.safeParse(req.params);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    await this._service.delete(validatedReq.data.id);
    return StandardResponse.create(res).setResponse({
      message: "Permission deleted successfully",
      status: HttpCode.OK,
    }).send();
  }
}
