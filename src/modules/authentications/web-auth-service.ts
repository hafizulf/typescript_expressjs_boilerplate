import { inject, injectable } from "inversify";
import { UserRepository } from "../users/user-repository";
import TYPES from "@/types";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { IWebAuth, WebAuthDomain } from "./web-auth-domain";
import { IResponseLogin } from "./web-auth-dto";
import { JWT_SECRET_KEY, JWT_SECRET_KEY_TTL, JWT_REFRESH_SECRET_KEY, JWT_REFRESH_SECRET_TTL } from "@/config/env";
import { RefreshTokenRepository } from "../refresh-tokens/refresh-token-repository";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { RedisClient } from "@/libs/redis/redis-client";
import { RoleRepository } from "@/modules/roles/role-repository";
import { USER_ROLE_EXPIRATION } from "@/libs/redis/redis-env";

@injectable()
export class WebAuthService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: UserRepository,
    @inject(TYPES.IRefreshTokenRepository) private _refreshTokenRepository: RefreshTokenRepository,
    @inject(TYPES.IRoleRepository) private _roleRepository: RoleRepository,
  ) {}

  public async login(
    { email, password }: { email: string; password: string }
  ): Promise<IResponseLogin> {
    const userData = await this._userRepository.findByEmail(email);
    if(!userData.verifyPassword(password)) {
      throw new AppError({
        statusCode: HttpCode.UNAUTHORIZED,
        description: "Wrong password",
      })
    }

    const userDataUnmarshal = { ...userData.unmarshal(), password: undefined };
    const auth = WebAuthDomain.create({ user: userDataUnmarshal }, JWT_SECRET_KEY, JWT_SECRET_KEY_TTL).unmarshal();
    const user = {
      id: auth.user.id,
      fullName: auth.user.fullName,
      avatarPath: auth.user.avatarPath,
    };

    // generate refresh token
    const refreshToken = WebAuthDomain.create(
      { user: userDataUnmarshal }, JWT_REFRESH_SECRET_KEY, JWT_REFRESH_SECRET_TTL
    ).unmarshal().token;
    await this._refreshTokenRepository.updateOrCreate(userData.id, refreshToken!);

    // caching user role
    const cacheKey = `userRole:${user.id}`;
    const userRoleData = await this._roleRepository.findById(auth.user.roleId);
    await RedisClient.set(cacheKey, userRoleData.name, USER_ROLE_EXPIRATION);

    return { user, refreshToken, token: auth.token, };
  }

  public async getMe(token: string, jwt_key: string): Promise<IWebAuth> {
    const auth = WebAuthDomain.createFromToken(token, jwt_key);
    const userData = await this._userRepository.findById(auth.user.id);

    auth.user = {
      ...userData.unmarshal(),
      password: undefined,
    }

    return auth.unmarshal();
  }

  public async generateAccessToken(refreshToken: string): Promise<string> {
    try {
      const authUser = WebAuthDomain.createFromToken(refreshToken, JWT_REFRESH_SECRET_KEY); // verify signature and get user
      await this._refreshTokenRepository.findOne(authUser.user.id, refreshToken);

      return WebAuthDomain.create(authUser.unmarshal(), JWT_SECRET_KEY, JWT_SECRET_KEY_TTL).token;
    } catch (error) {
      if(error instanceof AppError) {
        // refresh token not found error
        console.error(error);
        throw error;
      }
      if(error instanceof TokenExpiredError) {
        throw new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: "Refresh token has been expired",
        })
      } else if(error instanceof JsonWebTokenError) {
        throw new AppError({
          statusCode: HttpCode.UNAUTHORIZED,
          description: "Invalid refresh token",
        })
      } else {
        console.log(error);
        throw new AppError({
          statusCode: HttpCode.INTERNAL_SERVER_ERROR,
          description: "Failed to generate access token",
          error: error,
        })
      }
    }
  }
}
