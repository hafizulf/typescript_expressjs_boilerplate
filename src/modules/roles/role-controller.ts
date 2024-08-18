import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { RoleService } from "./role-service";
import { Request, Response } from "express";
import { paginatedSchema } from "./role-validation";
import { AppError, HttpCode } from "@/exceptions/app-error";

@injectable()
export class RoleController {
  constructor(
    @inject(TYPES.RoleService) private _service: RoleService
  ) {

  }
  public async findAll(
    req: Request, 
    res: Response
  ): Promise<Response> {
    const validatedReq = paginatedSchema.safeParse(req.query);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const roles = await this._service.findAll();
    return res.status(200).json({
      data: roles,
    });
  }
}
