import { injectable, inject } from "inversify";
import { NamespaceConfigService } from "../namespaces/namespace-config-service";
import { Socket } from "socket.io";
import TYPES from "@/types";
import { RedisClient } from "@/libs/redis/redis-client";
import { RoleService } from "@/modules/roles/role-service";
import { USER_ROLE_EXPIRATION } from "@/libs/redis/redis-env";

@injectable()
export class SocketAuthorizationMiddleware {
  constructor(
    @inject(TYPES.NamespaceConfigService)
    private namespaceConfig: NamespaceConfigService,
    @inject(TYPES.RoleService)
    private _roleService: RoleService
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
        if (!user) {
          return next(new Error("Authentication error: User not authenticated"));
        }

        // based on webApi auth middleware
        const cacheKey = `userRole:${user.id}`;
        let userRole = await RedisClient.get(cacheKey);

        if (!userRole) {
          const userRoleData = await this._roleService.findById(user.roleId);
          userRole = userRoleData.name;
          await RedisClient.set(cacheKey, userRole, USER_ROLE_EXPIRATION);
        }

        if (!allowedRoles.includes(userRole)) {
          return next(new Error("Authorization error: Forbidden"));
        }

        next(); // Role is authorized
      } catch (error) {
        console.error("Authorization middleware error:", error);
        next(new Error("Authorization error"));
      }
    };
  }
}
