import { REDIS_HOST, REDIS_PORT } from "./redis-env";
import { createClient, RedisClientType } from "redis";

export class RedisClient {
  private static instance: RedisClientType | null = null;
  private constructor() {}

  public static getInstance(): RedisClientType {
    if(!RedisClient.instance) {
      RedisClient.instance = createClient({
        url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
      });

      RedisClient.instance.on('error', (err) => {
        console.error('Redis error:', err);
      })

      RedisClient.instance.connect().catch(console.error);
    }
    return RedisClient.instance;
  }

  public static async set(key: string, value: string, expiration?: number): Promise<void> {
    const client = RedisClient.getInstance();
    await client.set(key, value);
    if(expiration) await client.expire(key, expiration);
  }

  public static async get(key: string): Promise<string | null> {
    const client = RedisClient.getInstance();
    return await client.get(key);
  }

  public static async delete(key: string): Promise<void> {
    const client = RedisClient.getInstance();
    await client.del(key);
  }
}
