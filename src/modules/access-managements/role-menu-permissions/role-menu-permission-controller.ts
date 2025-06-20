import { HttpCode } from "@/exceptions/app-error";
import {
  bulkUpdateRoleMenuPermissionSchema,
  createRoleMenuPermissionSchema,
  findRoleMenuPermissionSchema,
  updateRoleMenuPermissionSchema
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

  public findByRoleId = async (req: Request, res: Response): Promise<Response> => {
    const validatedReq = validateSchema(findRoleMenuPermissionSchema, req.params);
    const data = await this._service.findByRoleId(validatedReq.roleId);

    return StandardResponse.create(res).setResponse({
      message: "Role menu permissions fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  public bulkUpdate = async (req: IAuthRequest, res: Response): Promise<Response> => {
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

  public store = async (req: IAuthRequest, res: Response): Promise<Response> => {
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

  public update = async (req: IAuthRequest, res: Response): Promise<Response> => {
    const validatedReq = validateSchema(updateRoleMenuPermissionSchema, { ...req.params, ...req.body });
    const data = await this._service.update({
      ...validatedReq,
      updatedBy: req.authUser.user.id,
    });

    return StandardResponse.create(res)
      .setResponse({
        message: 'Role menu permission updated successfully',
        status: HttpCode.OK,
        data,
      })
      .send();
  }
}
