import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { JWT_SECRET_KEY } from "@/config/env";
import { IAuthRequest } from "./auth-interface";
import { WebAuthService } from "@/modules/authentications/web-auth-service";
import { WebAuthDomain } from "@/modules/authentications/web-auth-domain";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(TYPES.WebAuthService) private _webAuthService: WebAuthService,
  ) {}

  async authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return next(new AppError({
        description: 'Token is missing',
        statusCode: HttpCode.UNAUTHORIZED
      }));
    }

    try {
      const authUser = await this._webAuthService.getMe(token, JWT_SECRET_KEY); // verify signature and get user
      const newReq = <IAuthRequest>req;
      newReq.authUser = WebAuthDomain.create(authUser, JWT_SECRET_KEY);

      return next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next(new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: 'Token has been expired',
        }));
      } else if (error instanceof JsonWebTokenError) {
        return next(new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: "Invalid token",
        }));
      } else {
        console.error(error);

        return next(new AppError({
          statusCode: HttpCode.INTERNAL_SERVER_ERROR,
          description: "Failed to authenticate user",
          error: error,
        }));
      }
    }
  }
}
