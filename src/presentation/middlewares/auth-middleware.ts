import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { JWT_REFRESH_SECRET_KEY, JWT_SECRET_KEY } from "@/config/env";
import { IAuthRequest } from "./auth-interface";
import { WebAuthService } from "@/modules/authentications/web-auth-service";
import { WebAuthDomain } from "@/modules/authentications/web-auth-domain";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(TYPES.WebAuthService) private _webAuthService: WebAuthService,
  ) {}

  async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
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
        const refreshToken = req.cookies.refreshToken; // get refresh token
        if (!refreshToken) {
          return next(new AppError({
            statusCode: HttpCode.UNAUTHORIZED,
            description: 'Refresh token is missing, try to login again',
          }));
        }

        try {
          const authUser = await this._webAuthService.getMe(refreshToken, JWT_REFRESH_SECRET_KEY);

          // Set new access token in the Authorization header
          if (!res.headersSent) {
            res.setHeader("Authorization", `Bearer ${authUser.token}`);
          }
          const newReq = <IAuthRequest>req;
          newReq.authUser = WebAuthDomain.create(authUser, JWT_REFRESH_SECRET_KEY);

          return next();
        } catch (error) {
          return next(new AppError({
            statusCode: 401,
            description: "Invalid refresh token",
          }));
        }
      } else if (error instanceof JsonWebTokenError) {
        return next(new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: "Invalid token",
        }));
      } else {
        return next(new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: "Authentication error",
        }));
      }
    }
  }
}
