import {
  bulkUpdateMenuPermissionSchema,
  createMenuPermissionSchema,
  deleteMenuPermissionSchema,
  findMenuPermissionByIdSchema,
  paginatedMenuPermissionSchema,
  updateMenuPermissionSchema
} from "./menu-permission-validation";
import { HttpCode } from '@/exceptions/app-error';
import { inject, injectable } from "inversify";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";
import { MenuPermissionService } from "./menu-permission-service";
import { Request, Response } from "express";
import { StandardResponse } from "@/libs/standard-response";
import TYPES from "@/types";
import { validateSchema } from "@/helpers/schema-validator";

@injectable()
export class MenuPermissionController {
  constructor(
    @inject(TYPES.MenuPermissionService) private _service: MenuPermissionService
  ) {}

  public async findAll(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(paginatedMenuPermissionSchema, req.query);
    const [data, pagination] = await this._service.findAll(validatedReq);

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
    const validatedReq = validateSchema(createMenuPermissionSchema, req.body);
    const data = await this._service.store({
      ...validatedReq,
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
    const validatedReq = validateSchema(findMenuPermissionByIdSchema, req.params);
    const data = await this._service.findById(validatedReq.id);

    return StandardResponse.create(res)
      .setResponse({
        message: 'Menu permission fetched successfully',
        status: HttpCode.OK,
        data,
      })
      .send();
  }

  public async update(req: IAuthRequest, res: Response): Promise<Response> {
    const validatedReq = validateSchema(updateMenuPermissionSchema, {
      ...req.params,
      ...req.body,
    });
    const data = await this._service.update(validatedReq.id, {
      ...req.body,
      updatedBy: req.authUser.user.id,
    });

    return StandardResponse.create(res)
      .setResponse({
        message: 'Menu permission updated successfully',
        status: HttpCode.OK,
        data,
      })
      .send();
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(deleteMenuPermissionSchema, req.params);

    await this._service.delete(validatedReq.id);

    return StandardResponse.create(res)
      .setResponse({
        message: 'Menu permission deleted successfully',
        status: HttpCode.OK,
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
    const validatedReq = validateSchema(bulkUpdateMenuPermissionSchema, req.body);

    const data = await this._service.bulkUpdate(
      validatedReq.menuPermissions,
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
