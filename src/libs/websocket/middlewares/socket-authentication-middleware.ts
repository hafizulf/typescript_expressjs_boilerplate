import { injectable, inject } from "inversify";
import { JWT_SECRET_KEY } from "@/config/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NamespaceConfigService } from "../namespaces/namespace-config-service";
import { RedisClient } from "@/libs/redis/redis-client";
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
        console.log(`Skipping auth for public namespace: ${namespace}`);
        return next(); // Skip authentication
      }

      const token = socket.handshake.auth?.token;
      if (!token) {
        console.error("No token provided, rejecting connection.");
        return next(new Error("Authentication error: No token provided"));
      }

      try {
        const redisKey = `auth:token:${token}`;
        const userAuthenticated = await RedisClient.get(redisKey);
        if (userAuthenticated) {
          const parsedUser = JSON.parse(userAuthenticated);
          socket.data.user = parsedUser.user;
          return next();
        }

        const decoded = jwt.decode(token) as JwtPayload;
        if (!decoded?.exp) {
          return next(new Error('Invalid token payload (no exp)'));
        }

        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl <= 0) {
          return next(new Error('Token has been expired'));
        }

        const authUser = await this._webAuthService.getMe(token, JWT_SECRET_KEY);
        await RedisClient.set(redisKey, JSON.stringify(authUser), ttl);
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
