import { injectable, inject } from "inversify";
import { NamespaceConfigService } from "../namespaces/namespace-config-service";
import { Socket } from "socket.io";
import TYPES from "@/types";
import { RedisClient } from "@/libs/redis/redis-client";
import { getUserDataKey } from "@/helpers/redis-keys";
import { JWT_REFRESH_SECRET_TTL } from "@/config/env";
import { UserService } from "@/modules/users/user-service";
import { IUser } from "@/modules/users/user-domain";

@injectable()
export class SocketAuthorizationMiddleware {
  constructor(
    @inject(TYPES.NamespaceConfigService)
    private namespaceConfig: NamespaceConfigService,
    @inject(TYPES.UserService)
    private _userService: UserService
  ) {}

  public handle(allowedRoles: string[]) {
    return async (
      socket: Socket,
      next: (err?: Error) => void
    ) => {
      const namespace = socket.nsp.name;
      if(this.namespaceConfig.publicNamespaces.includes(namespace)) {
        return next();
      }

      try {
        const user = socket.data.user;
        if (!user?.id) {
          return next(new Error("Authorization error: Missing user in socket context"));
        }

        const userDataKey = getUserDataKey(user.id);
        let userData: IUser;

        const cachedUserData = await RedisClient.get(userDataKey);
        if (cachedUserData) {
          userData = JSON.parse(cachedUserData);
        } else {
          const freshUser = await this._userService.findWithRoleByUserId(user.id);
          userData = freshUser;
          await RedisClient.set(userDataKey, JSON.stringify(userData), JWT_REFRESH_SECRET_TTL);
        }

        if (!allowedRoles.includes(userData.role!.name)) {
          return next(new Error("Authorization error: Forbidden"));
        }

        return next();
      } catch (error) {
        console.error("Socket role authorization error:", error);
        return next(new Error("Authorization error"));
      }
    };
  }
}
