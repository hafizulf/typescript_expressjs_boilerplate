import { HttpCode } from "@/exceptions/app-error";

export interface ISetResponse<T> {
  status: HttpCode,
  message?: string,
  data?: T
}

export interface TStandardPaginateOption {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  orderBy?: string;
}
