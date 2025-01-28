import { HttpCode } from "@/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { Request, Response } from "express";
import { changePasswordSchema, createUserSchema, deleteUserSchema, findByIdUserSchema, paginatedUsersSchema, updateUserSchema } from "./user-validation";
import { UserService } from "./user-service";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";
import { validateSchema } from "@/helpers/schema-validator";

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService) private _service: UserService,
  ) {}

  public async findAll(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(paginatedUsersSchema, req.query);
    const [users, pagination] = await this._service.findAll(validatedReq);

    return StandardResponse.create(res).setResponse({
      message: "Users fetched successfully",
      status: HttpCode.OK,
      data: users,
    }).withPagination(pagination?.omitProperties("offset")).send();
  }

  public async store(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = validateSchema(createUserSchema, {
      ...req.body,
      avatarPath: req.file
    });
    const user = await this._service.store({
      updatedBy: req.authUser.user.id,
      ...validatedReq
    });

    return StandardResponse.create(res).setResponse({
      message: "User created successfully",
      status: HttpCode.RESOURCE_CREATED,
      data: user,
    }).send();
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(findByIdUserSchema, req.params);
    const data = await this._service.findById(validatedReq.id);

    return StandardResponse.create(res).setResponse({
      message: "User fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  async update(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = validateSchema(updateUserSchema, {
      ...req.params,
      ...req.body,
      avatarPath: req.file,
    });
    const result = await this._service.update({
      updatedBy: req.authUser.user.id,
      ...validatedReq
    });

    return StandardResponse.create(res).setResponse({
      message: "User updated successfully",
      status: HttpCode.OK,
      data: result
    }).send();
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(deleteUserSchema, req.params);
    await this._service.destroy(validatedReq.id);

    return StandardResponse.create(res).setResponse({
      message: "User deleted successfully",
      status: HttpCode.OK,
    }).send();
  }

  public async changePassword(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = validateSchema(changePasswordSchema, req.body);
    await this._service.changePassword({
      updatedBy: req.authUser.user.fullName,
      ...validatedReq
    });

    return StandardResponse.create(res).setResponse({
      message: "Password changed successfully",
      status: HttpCode.OK,
    }).send();
  }
}
