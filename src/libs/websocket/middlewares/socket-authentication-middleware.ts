import { injectable, inject } from "inversify";
import { JWT_SECRET_KEY } from "@/config/env";
import { NamespaceConfigService } from "../namespaces/namespace-config-service";
import { Socket } from "socket.io";
import { TokenExpiredError } from "jsonwebtoken";
import TYPES from "@/types";
import { WebAuthService } from "@/modules/authentications/web-auth-service";

@injectable()
export class SocketAuthenticationMiddleware {
  constructor(
    @inject(TYPES.NamespaceConfigService)
    private namespaceConfig: NamespaceConfigService,
    @inject(TYPES.WebAuthService)
    private _webAuthService: WebAuthService,
  ) {}

  public handle() {
    return async (
      socket: Socket,
      next: (err?: Error) => void
    ) => {
      const namespace = socket.nsp.name;
      if (this.namespaceConfig.publicNamespaces.includes(namespace)) {
        return next(); // Skip authentication for public namespaces
      }

      const token = socket.handshake.auth?.token;
      if (!token) {
        console.error("No token provided, rejecting connection.");
        return next(new Error("Authentication error: No token provided"));
      }

      try {
        const authUser = await this._webAuthService.getMe(token, JWT_SECRET_KEY);
        socket.data.user = authUser.user; // Attach user to socket instance
        next(); // Allow connection
      } catch (error) {
        console.error("Invalid token, rejecting connection.");
        if (error instanceof TokenExpiredError) {
          next(new Error("Authentication error: Token has expired"));
        } else {
          next(new Error("Authentication error: Invalid token"));
        }
      }
    };
  }
}
