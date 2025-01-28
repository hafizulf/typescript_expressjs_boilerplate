import { HttpCode } from "@/exceptions/app-error";
import {
  bulkUpdateRoleMenuPermissionSchema,
  createRoleMenuPermissionSchema,
  findRoleMenuPermissionSchema
} from "./role-menu-permission-validation";
import { inject, injectable } from "inversify";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";
import { RoleMenuPermissionService } from "./role-menu-permission-service";
import { Request, Response } from "express";
import { StandardResponse } from "@/libs/standard-response";
import TYPES from "@/types";
import { validateSchema } from "@/helpers/schema-validator";

@injectable()
export class RoleMenuPermissionController {
  constructor(
    @inject(TYPES.RoleMenuPermissionService) private _service: RoleMenuPermissionService,
  ) {}

  public async findByRoleId(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(findRoleMenuPermissionSchema, req.params);
    const data = await this._service.findByRoleId(validatedReq.roleId);

    return StandardResponse.create(res).setResponse({
      message: "Role menu permissions fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  public async bulkUpdate(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = validateSchema(
      bulkUpdateRoleMenuPermissionSchema,
      { ...req.params, ...req.body }
    );

    const data = await this._service.bulkUpdate(
      validatedReq,
      req.authUser.user.id
    );

    return StandardResponse.create(res)
      .setResponse({
        message: 'Role menu permissions updated successfully',
        status: HttpCode.OK,
        data,
      })
      .send();
  }

  public async store(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = validateSchema(createRoleMenuPermissionSchema, req.body);
    const data = await this._service.store({
      ...validatedReq,
      updatedBy: req.authUser.user.id,
    });

    return StandardResponse.create(res)
      .setResponse({
        message: 'Role menu permission created successfully',
        status: HttpCode.RESOURCE_CREATED,
        data,
      })
      .send();
  }
}
