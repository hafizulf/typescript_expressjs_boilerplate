import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { JWT_SECRET_KEY } from "@/config/env";
import { IAuthRequest } from "./auth-interface";
import { WebAuthService } from "@/modules/authentications/web-auth-service";
import { WebAuthDomain } from "@/modules/authentications/web-auth-domain";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { RedisClient } from "@/libs/redis/redis-client";
import { USER_ROLE_EXPIRATION } from "@/libs/redis/redis-env";
import { RoleService } from "@/modules/roles/role-service";

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(TYPES.WebAuthService) private _webAuthService: WebAuthService,
    @inject(TYPES.RoleService) private _roleService: RoleService,
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
      const redisKey = `auth:token:${token}`;
      const userAuthenticated = await RedisClient.get(redisKey);
      const newReq = req as IAuthRequest;

      if (userAuthenticated) {
        const parsedUser = JSON.parse(userAuthenticated);
        newReq.authUser = WebAuthDomain.create(parsedUser, JWT_SECRET_KEY);
        return next();
      }

      const decoded = jwt.decode(token) as JwtPayload;
      if (!decoded?.exp) {
        return next(new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: 'Invalid token payload (no exp)',
        }));
      }

      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl <= 0) {
        return next(new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: 'Token has been expired',
        }));
      }

      const authUser = await this._webAuthService.getMe(token, JWT_SECRET_KEY); // verify signature and get user
      if (!authUser?.user?.id) {
        return next(new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: 'Failed to resolve authenticated user',
        }));
      }

      newReq.authUser = WebAuthDomain.create(authUser, JWT_SECRET_KEY);
      await RedisClient.set(redisKey, JSON.stringify(authUser), ttl);
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

  roleAuthorize(allowedRoles: string[]) {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      const authUser = (req as IAuthRequest).authUser;
      const cacheKey = `userRole:${authUser.user.id}`;

      let userRole = await RedisClient.get(cacheKey);
      if(!userRole) {
        const userRoleData = await this._roleService.findById(authUser.user.roleId);
        userRole = userRoleData.name;
        await RedisClient.set(cacheKey, userRole, USER_ROLE_EXPIRATION);
      }

      if (!allowedRoles.includes(userRole)) {
        return next(new AppError({
          statusCode: HttpCode.FORBIDDEN,
          description: 'Forbidden',
        }));
      }

      return next();
    }
  }
}
