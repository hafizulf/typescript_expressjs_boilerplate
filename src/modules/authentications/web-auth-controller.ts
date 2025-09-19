import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import TYPES from "@/types";
import { WebAuthService } from "./web-auth-service";
import { HttpCode } from "@/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { generateAccessTokenSchema, loginSchema, logoutSchema, revokeRefreshTokenSchema } from "./web-auth-validation";
import { APP_ENV, JWT_REFRESH_SECRET_TTL } from "@/config/env";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";
import jwt from "jsonwebtoken";
import { TdecodedUserToken } from "./web-auth-dto";
import { RefreshTokenService } from "../refresh-tokens/refresh-token-service";
import { validateSchema } from "@/helpers/schema-validator";

@injectable()
export class WebAuthController {
  constructor(
    @inject(TYPES.WebAuthService) private _service: WebAuthService,
    @inject(TYPES.RefreshTokenService) private _refreshTokenService: RefreshTokenService,
  ) {}

  public login = async (req: Request, res: Response): Promise<Response> => {
    const validatedReq = validateSchema(loginSchema, req.body);
    const data = await this._service.login({...validatedReq});

    // set refresh token to http-only cookie
    const cookiesMaxAge = JWT_REFRESH_SECRET_TTL * 1000;
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

  public getMe = async (req: IAuthRequest, res: Response): Promise<Response> => {
    return StandardResponse.create(res).setResponse({
      message: "Fetched me successfully",
      status: HttpCode.OK,
      data: req.authUser.user.unmarshal(),
    }).send();
  }

  public generateAccessToken = async (req: Request, res: Response): Promise<Response> => {
    const validatedReq = validateSchema(generateAccessTokenSchema, req.cookies);
    const token = await this._service.generateAccessToken(validatedReq.refreshToken);

    return StandardResponse.create(res).setResponse({
      message: "Generated token successfully",
      status: HttpCode.OK,
      data: token,
    }).send();
  }

  public revokeRefreshToken = async (req: Request, res: Response): Promise<Response> => {
    const validatedReq = validateSchema(revokeRefreshTokenSchema, req.params);
    await this._refreshTokenService.revokeRefreshToken(validatedReq.userId);

    return StandardResponse.create(res).setResponse({
      message: "Refresh token revoked successfully",
      status: HttpCode.OK,
    }).send();
  }

  public logout = async (req: Request, res: Response): Promise<Response> => {
    const validatedReq = validateSchema(logoutSchema, req.cookies);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: APP_ENV === 'production',
      sameSite: 'strict',
    });

    const decodedUser = jwt.decode(validatedReq.refreshToken) as TdecodedUserToken;
    await this._refreshTokenService.revokeRefreshToken(decodedUser.id);

    return StandardResponse.create(res).setResponse({
      message: "Logged out successfully",
      status: HttpCode.OK,
    }).send();
  }
}
