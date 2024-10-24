import { injectable } from "inversify";
import { IRefreshTokenRepositoryInterface } from "./refresh-token-repository-interface";
import { RefreshToken as RefreshTokenPersistence } from "./refresh-token-model";

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepositoryInterface {
  async updateOrCreate(userId: string, refreshToken: string): Promise<void> {
    const data = await RefreshTokenPersistence.findOne({ where: { userId } });
    if (data) {
      data.token = refreshToken;
      data.updatedAt = new Date();
      await data.save();
    } else {
      await RefreshTokenPersistence.create({ userId, token: refreshToken, createdAt: new Date() });
    }
  }
}
