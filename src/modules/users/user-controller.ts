import { AppError, HttpCode } from "@/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { Request, Response } from "express";
import { paginatedUsersSchema } from "./user-validation";
import { UserService } from "./user-service";

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService) private _service: UserService,
  ) {}

  public async findAll(req: Request, res: Response): Promise<Response> {
    const validatedReq = paginatedUsersSchema.safeParse(req.query);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const [users, pagination] = await this._service.findAll(validatedReq.data);
    return StandardResponse.create(res).setResponse({
      message: "Users fetched successfully",
      status: HttpCode.OK,
      data: users,
    }).withPagination(pagination?.omitProperties("offset")).send();
  }
}
