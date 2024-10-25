import { WebAuthDomain } from "@/modules/authentications/web-auth-domain";
import { Request } from "express";

export interface IAuthRequest extends Request {
  authUser: WebAuthDomain;
}
