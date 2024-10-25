import { inject, injectable } from "inversify";
import { UserRepository } from "../users/user-repository";
import TYPES from "@/types";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { IWebAuth, WebAuthDomain } from "./web-auth-domain";
import { IResponseLogin } from "./web-auth-dto";
import { JWT_SECRET_KEY, JWT_SECRET_KEY_TTL, JWT_REFRESH_SECRET_KEY, JWT_REFRESH_SECRET_TTL } from "@/config/env";
import { RefreshTokenRepository } from "../refresh-tokens/refresh-token-repository";

@injectable()
export class WebAuthService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: UserRepository,
    @inject(TYPES.IRefreshTokenRepository) private _refreshTokenRepository: RefreshTokenRepository,
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
}