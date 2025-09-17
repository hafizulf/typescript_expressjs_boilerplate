import { JWT_SECRET_TTL } from "@/config/env";
import { RedisClient } from "@/libs/redis/redis-client";
import { injectable } from "inversify";
import { RoleMenuPermissionDto } from "./role-menu-permission-dto";

@injectable()
export class RoleMenuPermissionCache {
  private readonly ttl: number = JWT_SECRET_TTL;

  private key(roleId: string): string {
    return `role:menu-permissions:${roleId}`;
  }

  async get(roleId: string): Promise<RoleMenuPermissionDto | []> {
    const raw = await RedisClient.get(this.key(roleId));
    return raw ? (JSON.parse(raw) as RoleMenuPermissionDto) : [];
  }

  async set(roleId: string, rmp: RoleMenuPermissionDto | [], ttl?: number): Promise<void> {
    await RedisClient.set(this.key(roleId), JSON.stringify(rmp), ttl || this.ttl);
  }

  async invalidate(roleId: string): Promise<void> {
    await RedisClient.delete(this.key(roleId));
  }
}
