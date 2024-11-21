import TYPES from "@/types";
import { inject, injectable } from "inversify";
import { AnnouncementService } from "./announcement-service";
import { Request, Response } from "express";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { createAnnouncementSchema, findByIdSchema } from "./announcement-validation";

@injectable()
export class AnnouncementController {
  constructor(
    @inject(TYPES.AnnouncementService) private _service: AnnouncementService,
  ) {}

  public async store(req: Request, res: Response): Promise<Response> {
    const validatedReq = createAnnouncementSchema.safeParse(req.body);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const data = await this._service.store(validatedReq.data);

    return StandardResponse.create(res).setResponse({
      message: "Announcement created successfully",
      status: HttpCode.RESOURCE_CREATED,
      data,
    }).send();
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    const validatedReq = findByIdSchema.safeParse(req.params);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      })
    }

    const data = await this._service.findById(validatedReq.data.id);

    return StandardResponse.create(res).setResponse({
      message: "Announcement fetched successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }
}
