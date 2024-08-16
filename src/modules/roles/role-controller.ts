import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { RoleService } from "./role-service";
import { Request, Response } from "express";

@injectable()
export class RoleController {
  constructor(
    @inject(TYPES.RoleService) private _service: RoleService
  ) {

  }
  public async findAll(_req: Request, res: Response): Promise<Response> {
    const roles = await this._service.findAll();
    return res.status(200).json({
      data: roles,
    });
  }
}
