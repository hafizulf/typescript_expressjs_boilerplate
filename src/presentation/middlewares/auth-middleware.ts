import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { JWT_SECRET_KEY } from "@/config/env";
import { IAuthRequest } from "./auth-interface";
import { WebAuthService } from "@/modules/authentications/web-auth-service";
import { WebAuthDomain } from "@/modules/authentications/web-auth-domain";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { TokenErrMessage } from "@/exceptions/error-message-constants";
import { RoleMenuPermissionDto } from "@/modules/access-managements/role-menu-permissions/role-menu-permission-dto";
import { REQUEST_PERMISSIONS } from "@/modules/access-managements/menus/dto/enabled-menu";
import { UserCache } from "@/modules/users/user-cache";
import { RoleMenuPermissionCache } from "@/modules/access-managements/role-menu-permissions/role-menu-permission-cache";
import { RoleMenuPermissionRepository } from "@/modules/access-managements/role-menu-permissions/role-menu-permission-repository";

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(TYPES.WebAuthService) private _webAuthService: WebAuthService,
    @inject(TYPES.IRoleMenuPermissionRepository) private _roleMenuPermissionRepository: RoleMenuPermissionRepository,
    @inject(TYPES.UserCache) private _userCache: UserCache,
    @inject(TYPES.RoleMenuPermissionCache) private _roleMenuPermissionCache: RoleMenuPermissionCache,
  ) {}

  authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return next(new AppError({
        description: TokenErrMessage.MISSING,
        statusCode: HttpCode.UNAUTHORIZED
      }));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
      if (!decoded.id || !decoded.exp || typeof decoded.tokenVersion !== 'number') {
        return next(new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: TokenErrMessage.INVALID_PAYLOAD,
        }));
      }

      const userData = await this._userCache.get(decoded.id);
      const newReq = req as IAuthRequest;
      if (userData) {
        newReq.authUser = WebAuthDomain.create({ token, user: userData }, JWT_SECRET_KEY);
        return next();
      }

      const authUser = await this._webAuthService.getMe(token, JWT_SECRET_KEY); // verify signature and get user
      if (!authUser?.user?.id) {
        return next(new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: 'Failed to resolve authenticated user',
        }));
      }

      if(decoded.tokenVersion !== authUser.user.tokenVersion) {
        return next(new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: TokenErrMessage.REVOKED,
        }));
      }

      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      await this._userCache.set(authUser.user, ttl);
      
      newReq.authUser = WebAuthDomain.create(authUser, JWT_SECRET_KEY);

      return next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next(new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: TokenErrMessage.EXPIRED,
        }));
      } else if (error instanceof JsonWebTokenError) {
        return next(new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: TokenErrMessage.INVALID,
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

  roleAuthorize = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authReq = req as IAuthRequest;
    const userRoleId = authReq.authUser.user.roleId;
    let rmp: RoleMenuPermissionDto | [] = await this._roleMenuPermissionCache.get(userRoleId);

    if(Array.isArray(rmp)) {
      const roleMenuPermissions = await this._roleMenuPermissionRepository.findByRoleId(userRoleId);
      if(Array.isArray(roleMenuPermissions)) {
        return next(new AppError({
          statusCode: HttpCode.FORBIDDEN,
          description: 'Forbidden',
        }));
      } else {
        rmp = roleMenuPermissions;
      }
    }

    if(!Array.isArray(rmp) && rmp.menus.length > 0) {
      const segments = req.path.split('/').filter(Boolean); 
      let basePath = '/' + segments[0]; 
      if (segments[0] === 'auths' && segments[1]) {
        basePath = '/' + segments[1];
      }

      const menu = rmp.menus.find((menu) => {
        let menuPath: string;
        if (segments[0] === 'auths' && segments[1]) {
          menuPath = menu.path;
        } else {
          menuPath = `${menu.path}s`;
        }

        return menuPath === basePath;
      });
      if (!menu) {
        return next(new AppError({
          statusCode: HttpCode.FORBIDDEN,
          description: 'Forbidden',
        }));
      }

      // then check if permission is allowed like READ ["GET"] is allowed
      const method = req.method as keyof typeof REQUEST_PERMISSIONS;
      const allowedPermissions = REQUEST_PERMISSIONS[method] || [];
      const hasPermission = menu.permissionList.some(p => allowedPermissions.includes(p.permission) && p.isPermitted); // check if permission is allowed

      if (!hasPermission) {
        return next(new AppError({
          statusCode: HttpCode.FORBIDDEN,
          description: 'Forbidden',
        }));
      }

      await this._roleMenuPermissionCache.set(userRoleId, rmp);
    } else {
      return next(new AppError({
        statusCode: HttpCode.FORBIDDEN,
        description: 'Forbidden',
      }));
    }

    return next();
  }
}
