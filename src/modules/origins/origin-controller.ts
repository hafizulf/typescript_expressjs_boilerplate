import { HttpCode } from "@/exceptions/app-error";
import { inject, injectable } from "inversify";
import { OriginService } from "./origin-service";
import { createOriginSchema, deleteOriginSchema, paginatedOriginSchema, updateOriginSchema } from "./origin-validation";
import { Request, Response } from "express";
import { StandardResponse } from "@/libs/standard-response";
import TYPES from "@/types";
import { validateSchema } from "@/helpers/schema-validator";
import { findByIdSchema } from "../announcements/announcement-validation";

@injectable()
export class OriginController {
  constructor(
    @inject(TYPES.OriginService) private _service: OriginService,
  ) {}

  public store = async (req: Request, res: Response): Promise<Response> => {
    const validatedReq = validateSchema(createOriginSchema, req.body);
    const data = await this._service.store(validatedReq);

    return StandardResponse.create(res).setResponse({
      message: "Origin created successfully",
      status: HttpCode.RESOURCE_CREATED,
      data,
    }).send();
  }

  public findAll = async (req: Request, res: Response): Promise<Response> => {
    const validatedReq = validateSchema(paginatedOriginSchema, req.query);
    const [roles, pagination] = await this._service.findAll(validatedReq);

    return StandardResponse.create(res).setResponse({
      message: "Origin fetched successfully",
      status: HttpCode.OK,
      data: roles,
    }).withPagination(pagination?.omitProperties("offset")).send();
  }

  public findById = async (req: Request, res: Response): Promise<Response> => {
    const validatedReq = validateSchema(findByIdSchema, req.params);
    const data = await this._service.findById(validatedReq.id);

    return StandardResponse.create(res).setResponse({
      message: "Origin fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  public update = async (req: Request, res: Response): Promise<Response> => {
    const validatedReq = validateSchema(updateOriginSchema, { ...req.params, ...req.body });
    const { id, ...propsData } = validatedReq;
    const data = await this._service.update(id, propsData);

    return StandardResponse.create(res).setResponse({
      message: "Origin updated successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }

  public delete = async (req: Request, res: Response): Promise<Response> => {
    const validatedReq = validateSchema(deleteOriginSchema, req.params);
    await this._service.delete(validatedReq.id);

    return StandardResponse.create(res).setResponse({
      message: "Origin deleted successfully",
      status: HttpCode.OK,
    }).send();
  }
}