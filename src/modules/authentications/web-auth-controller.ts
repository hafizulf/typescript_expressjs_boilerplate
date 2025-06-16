import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import TYPES from "@/types";
import { WebAuthService } from "./web-auth-service";
import { HttpCode } from "@/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { generateAccessTokenSchema, loginSchema, logoutSchema } from "./web-auth-validation";
import ms from "ms";
import { APP_ENV, JWT_REFRESH_SECRET_TTL } from "@/config/env";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";
import jwt from "jsonwebtoken";
import { TdecodedUserToken } from "./web-auth-dto";
import { RedisClient } from "@/libs/redis/redis-client";
import { validateSchema } from "@/helpers/schema-validator";

@injectable()
export class WebAuthController {
  constructor(
    @inject(TYPES.WebAuthService) private _service: WebAuthService
  ) {}

  public async login(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(loginSchema, req.body)
    const data = await this._service.login({...validatedReq});

    // set refresh token to http-only cookie
    const cookiesMaxAge = ms(JWT_REFRESH_SECRET_TTL as ms.StringValue);
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: APP_ENV === "production",
      sameSite: "strict",
      maxAge: cookiesMaxAge,
    })

    return StandardResponse.create(res).setResponse({
      message: "Logged in successfully",
      status: HttpCode.OK,
      data: { user: data.user, token: data.token },
    }).send();
  }

  public async getMe(req: IAuthRequest, res: Response): Promise<Response> {
    return StandardResponse.create(res).setResponse({
      message: "Fetched me successfully",
      status: HttpCode.OK,
      data: req.authUser.user.unmarshal(),
    }).send();
  }

  public async generateAccessToken(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(generateAccessTokenSchema, req.cookies);
    const token = await this._service.generateAccessToken(validatedReq.refreshToken);

    return StandardResponse.create(res).setResponse({
      message: "Generated token successfully",
      status: HttpCode.OK,
      data: token,
    }).send();
  }

  public async logout(req: Request, res: Response): Promise<Response> {
    const validatedReq = validateSchema(logoutSchema, req.cookies);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: APP_ENV === 'production',
      sameSite: 'strict',
    });

    const decodedUser = jwt.decode(validatedReq.refreshToken) as TdecodedUserToken;
    const cacheKey = `userRole:${decodedUser.id}`;
    await RedisClient.delete(cacheKey);

    return StandardResponse.create(res).setResponse({
      message: "Logged out successfully",
      status: HttpCode.OK,
    }).send();
  }
}
