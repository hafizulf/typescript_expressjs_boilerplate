import { AppError, HttpCode } from "@/exceptions/app-error";
import { inject, injectable } from "inversify";
import { RoleMenuPermissionService } from "./role-menu-permission-service";
import { Request, Response } from "express";
import { StandardResponse } from "@/libs/standard-response";
import TYPES from "@/types";
import { findRoleMenuPermissionSchema } from "./role-menu-permission-validation";

@injectable()
export class RoleMenuPermissionController {
  constructor(
    @inject(TYPES.RoleMenuPermissionService) private _service: RoleMenuPermissionService,
  ) {}

  public async findByRoleId(req: Request, res: Response): Promise<Response> {
    const validatedReq = findRoleMenuPermissionSchema.safeParse(req.params);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    const data = await this._service.findByRoleId(validatedReq.data.roleId);

    return StandardResponse.create(res).setResponse({
      message: "Role menu permissions fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }
}
