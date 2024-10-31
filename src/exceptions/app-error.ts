import { APP_ENV } from "@/config/env";

export enum HttpCode {
  BAD_REQUEST = 400,
  CONFLICT = 409,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
  NO_CONTENT = 100,
  NOT_FOUND = 404,
  OK = 200,
  RESOURCE_CREATED = 201,
  UNAUTHORIZED = 401,
  VALIDATION_ERROR = 422,
}

interface AppErrorArgs {
  statusCode: HttpCode;
  description: string;
  name?: string;
  data?: any;
  error?: any;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly name: string;
  public readonly statusCode: HttpCode;
  public readonly isOperational: boolean = true;
  public readonly data?: any;
  public readonly error?: any;

  constructor(args: AppErrorArgs) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || "Error";
    this.statusCode = args.statusCode;
    this.data = args.data;
    this.error = APP_ENV !== "production" ? args.error : "";
    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Error.captureStackTrace(this);
  }
}
