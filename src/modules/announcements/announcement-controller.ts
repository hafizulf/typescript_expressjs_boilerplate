import { AnnouncementService } from "./announcement-service";
import  { createAnnouncementSchema, findByIdSchema } from "./announcement-validation";
import { HttpCode } from "@/exceptions/app-error";
import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { StandardResponse } from "@/libs/standard-response";
import TYPES from "@/types";
import { validateSchema } from "@/helpers/schema-validator";

@injectable()
export class AnnouncementController {
  constructor(
    @inject(TYPES.AnnouncementService) private _service: AnnouncementService,
  ) {}

  public store = async (req: Request, res: Response): Promise<Response> => {
    const validatedReq = validateSchema(createAnnouncementSchema, req.body);
    const data = await this._service.store(validatedReq);

    return StandardResponse.create(res).setResponse({
      message: "Announcement created successfully",
      status: HttpCode.RESOURCE_CREATED,
      data,
    }).send();
  }

  public findById = async (req: Request, res: Response): Promise<Response> => {
    const validatedReq = validateSchema(findByIdSchema, req.params);
    const data = await this._service.findById(validatedReq.id);

    return StandardResponse.create(res).setResponse({
      message: "Announcement fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }
}
