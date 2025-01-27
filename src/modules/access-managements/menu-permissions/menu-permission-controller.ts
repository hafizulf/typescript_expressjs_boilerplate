import { AppError, HttpCode } from "@/exceptions/app-error";
import { bulkUpdateMenuPermissionSchema, createMenuPermissionSchema, findMenuPermissionByIdSchema, paginatedMenuPermissionSchema } from "./menu-permission-validation";
import { inject, injectable } from "inversify";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";
import { MenuPermissionService } from "./menu-permission-service";
import { Request, Response } from "express";
import { StandardResponse } from "@/libs/standard-response";
import TYPES from "@/types";

@injectable()
export class MenuPermissionController {
  constructor(
    @inject(TYPES.MenuPermissionService) private _service: MenuPermissionService
  ) {}

  public async findAll(req: Request, res: Response): Promise<Response> {
    const validatedReq = paginatedMenuPermissionSchema.safeParse(req.query);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: 'Validation error',
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    const [data, pagination] = await this._service.findAll(validatedReq.data);

    return StandardResponse.create(res)
      .setResponse({
        message: 'Menu permissions fetched successfully',
        status: HttpCode.OK,
        data,
      })
      .withPagination(pagination?.omitProperties('offset'))
      .send();
  }

  public async store(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = createMenuPermissionSchema.safeParse(req.body);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: 'Validation error',
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    const data = await this._service.store({
      ...validatedReq.data,
      updatedBy: req.authUser.user.id,
    });
    return StandardResponse.create(res)
      .setResponse({
        message: 'Menu permission created successfully',
        status: HttpCode.RESOURCE_CREATED,
        data,
      })
      .send();
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    const validatedReq = findMenuPermissionByIdSchema.safeParse(req.params);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: 'Validation error',
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    const data = await this._service.findById(validatedReq.data.id);
    return StandardResponse.create(res)
      .setResponse({
        message: 'Menu permission fetched successfully',
        status: HttpCode.OK,
        data,
      })
      .send();
  }

  public async findAllGroupByMenus(
    _req: Request,
    res: Response
  ): Promise<Response> {
    const data = await this._service.findAllGroupByMenus();

    return StandardResponse.create(res)
      .setResponse({
        message: 'Menu permissions group by menus fetched successfully',
        status: HttpCode.OK,
        data,
      })
      .send();
  }

  public async bulkUpdate(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = bulkUpdateMenuPermissionSchema.safeParse(req.body);
    if (!validatedReq.success) {
      const detailedErrors = validatedReq.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: 'Validation error',
        data: detailedErrors, // Detailed errors with field paths and messages
      });
    }

    const data = await this._service.bulkUpdate(
      validatedReq.data.menuPermissions,
      req.authUser.user.id
    );
    return StandardResponse.create(res)
      .setResponse({
        message: 'Menu permissions updated successfully',
        status: HttpCode.OK,
        data,
      })
      .send();
  }

  public async seedMenuPermission(
    req: IAuthRequest,
    res: Response
  ): Promise<Response> {
    await this._service.seedMenuPermission(req.authUser.user.id);
    return StandardResponse.create(res)
      .setResponse({
        message: 'Menu permissions seeded successfully',
        status: HttpCode.RESOURCE_CREATED,
      })
      .send();
  }
}
