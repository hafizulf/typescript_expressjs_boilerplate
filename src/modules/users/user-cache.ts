import { JWT_SECRET_TTL } from "@/config/env";
import { RedisClient } from "@/libs/redis/redis-client";
import { IUser } from "./user-domain";
import { injectable } from "inversify";

@injectable()
export class UserCache {
  private readonly ttl: number = JWT_SECRET_TTL;

  private key(userId: string): string {
    return `user:data:${userId}`;
  }

  async get(userId: string): Promise<IUser | null> {
    const raw = await RedisClient.get(this.key(userId));
    return raw ? (JSON.parse(raw) as IUser) : null;
  }

  async set(user: IUser, ttl?: number): Promise<void> {
    await RedisClient.set(this.key(user.id!), JSON.stringify(user), ttl || this.ttl);
  }

  async invalidate(userId: string): Promise<void> {
    await RedisClient.delete(this.key(userId));
  }
}
