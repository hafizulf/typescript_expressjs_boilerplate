import { IUser, UserDomain } from "../users/user-domain";
import jwt from "jsonwebtoken";
import { AppError, HttpCode } from "@/exceptions/app-error";

export interface IWebAuth {
  token?: string;
  user: IUser;
}

export class WebAuthDomain {
  private props: IWebAuth;
  private constructor(props: IWebAuth, JWT_KEY: string, JWT_TTL?: string) {
    this.props = {
      ...props,
      token: props.token || jwt.sign(props.user, JWT_KEY, { expiresIn: JWT_TTL }),
    }
  }

  public static create(props: IWebAuth, JWT_KEY: string, JWT_TTL?: string): WebAuthDomain {
    return new WebAuthDomain(props, JWT_KEY, JWT_TTL);
  }

  public static createFromToken(token: string, JWT_KEY: string, JWT_TTL?: string): WebAuthDomain {
    try {
      const parsedAuth = <IUser>jwt.verify(token, JWT_KEY);
      return new WebAuthDomain({ user: parsedAuth, token }, JWT_KEY, JWT_TTL);
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.UNAUTHORIZED,
        description: "Invalid token"
      })
    }
  }

  public unmarshal(): IWebAuth {
    return {
      user: this.user.unmarshal(),
      token: this.token,
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
