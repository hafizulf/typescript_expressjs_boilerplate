import { inject, injectable } from "inversify";
import { UserRepository } from "../users/user-repository";
import TYPES from "@/types";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { IWebAuth, WebAuthDomain } from "./web-auth-domain";
import { IResponseLogin } from "./web-auth-dto";

@injectable()
export class WebAuthService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: UserRepository
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

    const auth = WebAuthDomain.create({ user: { ...userData.unmarshal(), password: undefined } }).unmarshal();
    const user = {
      id: auth.user.id,
      fullName: auth.user.fullName,
      avatarPath: auth.user.avatarPath,
    };

    return { user, token: auth.token };
  }

  public async getMe(token: string): Promise<IWebAuth> {
    const auth = WebAuthDomain.createFromToken(token);
    const userData = await this._userRepository.findById(auth.user.id);

    auth.user = {
      ...userData.unmarshal(),
      password: undefined,
    }

    return auth.unmarshal();
  }
}
