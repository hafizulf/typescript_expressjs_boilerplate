import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import TYPES from "@/types";
import { WebAuthService } from "./web-auth-service";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { generateAccessTokenSchema, loginSchema, logoutSchema } from "./web-auth-validation";
import ms from "ms";
import { APP_ENV, JWT_REFRESH_SECRET_TTL } from "@/config/env";
import { IAuthRequest } from "@/presentation/middlewares/auth-interface";

@injectable()
export class WebAuthController {
  constructor(
    @inject(TYPES.WebAuthService) private _service: WebAuthService
  ) {}

  public async login(req: Request, res: Response): Promise<Response> {
    const validatedReq = loginSchema.safeParse(req.body);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    const data = await this._service.login(req.body);

    // set refresh token to http-only cookie
    const cookiesMaxAge = ms(JWT_REFRESH_SECRET_TTL);
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
    const validatedReq = generateAccessTokenSchema.safeParse(req.cookies);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    const token = await this._service.generateAccessToken(validatedReq.data.refreshToken);

    return StandardResponse.create(res).setResponse({
      message: "Generated token successfully",
      status: HttpCode.OK,
      data: token,
    }).send();
  }

  public async logout(req: Request, res: Response): Promise<Response> {
    const validatedReq = logoutSchema.safeParse(req.cookies);
    if(!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: APP_ENV === 'production',
      sameSite: 'strict',
    });

    return StandardResponse.create(res).setResponse({
      message: "Logged out successfully",
      status: HttpCode.OK,
    }).send();
  }
}
