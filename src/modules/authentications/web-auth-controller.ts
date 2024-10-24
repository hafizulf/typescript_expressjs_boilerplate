import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import TYPES from "@/types";
import { WebAuthService } from "./web-auth-service";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { StandardResponse } from "@/libs/standard-response";
import { loginSchema } from "./web-auth-validation";
import ms from "ms";
import { APP_ENV, JWT_REFRESH_SECRET_TTL } from "@/config/env";

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

  public async getMe(req: Request, res: Response): Promise<Response> {
    const data = await this._service.getMe(
      <string>req.get("Authorization")?.split(" ")[1] || ""
    )

    return StandardResponse.create(res).setResponse({
      message: "Fetched me successfully",
      status: HttpCode.OK,
      data,
    }).send();
  }
}
