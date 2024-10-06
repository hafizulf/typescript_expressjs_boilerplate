import { JWT_SECRET_KEY, JWT_TTL } from "@/config/env";
import { IUser, UserDomain } from "../users/user-domain";
import jwt from "jsonwebtoken";
import { AppError, HttpCode } from "@/exceptions/app-error";

export interface IWebAuth {
  token?: string;
  user: IUser;
}

export class WebAuthDomain {
  private props: IWebAuth;
  private constructor(props: IWebAuth) {
    this.props = {
      ...props,
      token: props.token || jwt.sign(props.user, JWT_SECRET_KEY, { expiresIn: JWT_TTL }),
    }
  }

  public static create(props: IWebAuth): WebAuthDomain {
    return new WebAuthDomain(props);
  }

  public static createFromToken(token: string): WebAuthDomain {
    try {
      const parsedAuth = <IUser>jwt.verify(token, JWT_SECRET_KEY);
      return new WebAuthDomain({ user: parsedAuth, token });
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.UNAUTHORIZED,
        description: "Invalid token"
      })
    }
  }

  public unmarshal(): IWebAuth {
    return {
      token: this.token,
      user: this.user.unmarshal(),
    }
  }

  get token(): string {
    return this.props.token || "";
  }

  get user(): UserDomain {
    return UserDomain.create(this.props.user);
  }

  set user(val: IUser) {
    this.props.user = val;
  }
}
