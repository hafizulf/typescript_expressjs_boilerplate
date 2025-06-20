import { injectable, inject } from "inversify";
import { JWT_SECRET_KEY } from "@/config/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NamespaceConfigService } from "../namespaces/namespace-config-service";
import { RedisClient } from "@/libs/redis/redis-client";
import { Socket } from "socket.io";
import { TokenExpiredError } from "jsonwebtoken";
import TYPES from "@/types";
import { WebAuthService } from "@/modules/authentications/web-auth-service";
import { TokenErrMessage } from "@/exceptions/error-message-constants";
import { getUserDataKey } from "@/helpers/redis-keys";

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
        console.log(`Skipping auth for public namespace: ${namespace}`);
        return next(); // Skip authentication
      }

      const token = socket.handshake.auth?.token;
      if (!token) {
        console.error("No token provided, rejecting connection.");
        return next(new Error("Authentication error: No token provided"));
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
        if (!decoded.id || !decoded.exp || typeof decoded.tokenVersion !== 'number') {
          return next(new Error("Authentication error: " + TokenErrMessage.INVALID_PAYLOAD));
        }

        const userDataKey = getUserDataKey(decoded.id);
        const userData = await RedisClient.get(userDataKey);
        if (userData) {
          const parsedUser = JSON.parse(userData);
          socket.data.user = parsedUser;
          return next();
        }

        const authUser = await this._webAuthService.getMe(token, JWT_SECRET_KEY);
        if (!authUser?.user?.id) {
          return next(new Error("Authentication error: Failed to resolve authenticated user"));
        }

        if(decoded.tokenVersion !== authUser.user.tokenVersion) {
          return next(new Error("Authentication error: Token has been revoked"));
        }

        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        await RedisClient.set(userDataKey, JSON.stringify(authUser.user), ttl);

        socket.data.user = authUser.user;
        return next();
      } catch (error) {
        console.error("Invalid token, rejecting connection.");
        if (error instanceof TokenExpiredError) {
          next(new Error(`Authentication error: ${TokenErrMessage.EXPIRED}`));
        } else {
          next(new Error(`Authentication error: ${TokenErrMessage.INVALID}`));
        }
      }
    };
  }
}
