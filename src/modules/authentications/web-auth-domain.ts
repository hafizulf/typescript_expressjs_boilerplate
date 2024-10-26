import { IUser, UserDomain } from "../users/user-domain";
import jwt from "jsonwebtoken";

export interface IWebAuth {
  token?: string;
  user: IUser;
}

export class WebAuthDomain {
  private props: IWebAuth;
  private constructor(props: IWebAuth, jwt_key: string, jwt_ttl?: string) {
    this.props = {
      ...props,
      token: jwt_ttl
      ? jwt.sign({
          id: props.user.id,
          fullname: props.user.fullName,
        }, jwt_key, { expiresIn: jwt_ttl })
      : props.token,
    }
  }

  public static create(props: IWebAuth, jwt_key: string, jwt_ttl?: string): WebAuthDomain {
    return new WebAuthDomain(props, jwt_key, jwt_ttl);
  }

  public static createFromToken(token: string, jwt_key: string): WebAuthDomain {
    try {
      const parsedAuth = <IUser>jwt.verify(token, jwt_key);
      return new WebAuthDomain({ user: parsedAuth, token }, jwt_key);
    } catch (error) {
      // console.error("Token verification error:", error);
      throw error;
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
