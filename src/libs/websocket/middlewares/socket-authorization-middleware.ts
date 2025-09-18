import { injectable, inject } from "inversify";
import { NamespaceConfigService } from "../namespaces/namespace-config-service";
import { Socket } from "socket.io";
import TYPES from "@/types";
import { JWT_REFRESH_SECRET_TTL } from "@/config/env";
import { UserService } from "@/modules/users/user-service";
import { IUser } from "@/modules/users/user-domain";
import { UserCache } from "@/modules/users/user-cache";

@injectable()
export class SocketAuthorizationMiddleware {
  constructor(
    @inject(TYPES.NamespaceConfigService)
    private namespaceConfig: NamespaceConfigService,
    @inject(TYPES.UserService)
    private _userService: UserService,
    @inject(TYPES.UserCache)
    private _userCache: UserCache
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

        let userData: IUser | null = await this._userCache.get(user.id);
        if (!userData) {
          const freshUser = await this._userService.findWithRoleByUserId(user.id);
          userData = freshUser;
          await this._userCache.set(freshUser, JWT_REFRESH_SECRET_TTL);
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
