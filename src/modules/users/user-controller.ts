import { AppError, HttpCode } from "@/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { Request, Response } from "express";
import { changePasswordSchema, createUserSchema, deleteUserSchema, findByIdUserSchema, paginatedUsersSchema, updateUserSchema } from "./user-validation";
import { UserService } from "./user-service";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";

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

  public async store(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = createUserSchema.safeParse({
      ...req.body,
      avatarPath: req.file
    });

    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const user = await this._service.store({
      updatedBy: req.authUser.user.id,
      ...validatedReq.data
    });

    return StandardResponse.create(res).setResponse({
      message: "User created successfully",
      status: HttpCode.RESOURCE_CREATED,
      data: user,
    }).send();
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const validatedReq = findByIdUserSchema.safeParse(req.params);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const data = await this._service.findById(validatedReq.data.id);

    return StandardResponse.create(res).setResponse({
      message: "User fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  async update(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = updateUserSchema.safeParse({
      ...req.params,
      ...req.body,
      avatarPath: req.file
    });

    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    const result = await this._service.update({
      updatedBy: req.authUser.user.id,
      ...validatedReq.data
    });

    return StandardResponse.create(res).setResponse({
      message: "User updated successfully",
      status: HttpCode.OK,
      data: result
    }).send();
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const validatedReq = deleteUserSchema.safeParse(req.params);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    await this._service.destroy(validatedReq.data.id);

    return StandardResponse.create(res).setResponse({
      message: "User deleted successfully",
      status: HttpCode.OK,
    }).send();
  }

  public async changePassword(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = changePasswordSchema.safeParse(req.body);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    await this._service.changePassword({
      updatedBy: req.authUser.user.fullName,
      ...validatedReq.data
    });

    return StandardResponse.create(res).setResponse({
      message: "Password changed successfully",
      status: HttpCode.OK,
    }).send();
  }
}
