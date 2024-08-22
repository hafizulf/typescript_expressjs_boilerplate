import { Response } from "express";
import { HttpCode } from "@/exceptions/app-error";
import { IPagination } from "@/modules/common/interfaces/pagination-interface";
import { ISetResponse } from "@/modules/common/dto/pagination-dto";

export class StandardResponse<T> {
  private status: HttpCode = 200;
  private message: string = "success";
  private data: T | undefined
  private pagination: Omit<IPagination, "offset"> | undefined;

  private constructor(private _res: Response) {}

  public static create(res: Response) {
    return new StandardResponse(res);
  }

  /**
   *
   * @param status
   * @param message
   * @param data
   */
  setResponse({
    status,
    message = "success",
    data
  }: ISetResponse<T>): StandardResponse<T> {
    this.message = message;
    this.status = status;
    this.data = data;

    return this;
  }

  /**
   *
   * @param pagination
   */
  withPagination(
    pagination: Omit<IPagination, "offset"> | undefined
  ): StandardResponse<T> {
    this.pagination = pagination;
    return this;
  }

  send(): Response {
    return this._res.status(this.status).json({
      message: this.message,
      ...(this.data && { data: this.data }),
      pagination: this.pagination,
    });
  }

}
