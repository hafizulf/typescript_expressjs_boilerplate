import { RefreshTokenDomain } from "./refresh-token-domain";

export interface IRefreshTokenRepository {
  updateOrCreate(userId: string, refreshToken: string): Promise<void>;
  findOne(userId: string, token: string): Promise<boolean>;
  findAll(): Promise<RefreshTokenDomain[]>;
  delete(token: string): Promise<void>;
  revoke(userId: string): Promise<RefreshTokenDomain>;
}
