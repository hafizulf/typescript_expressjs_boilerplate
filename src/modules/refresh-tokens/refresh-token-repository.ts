import { injectable } from "inversify";
import { IRefreshTokenRepositoryInterface } from "./refresh-token-repository-interface";
import { RefreshToken as RefreshTokenPersistence } from "./refresh-token-model";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { RefreshTokenDomain } from "./refresh-token-domain";

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

  async findOne(userId: string, token: string): Promise<boolean> {
    const data = await RefreshTokenPersistence.findOne({ where: { userId, token } });
    // return !!data; // return true if data exists
    if(!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Refresh token not found",
      })
    }
    return true;
  }

  async findAll(): Promise<RefreshTokenDomain[]> {
    const tokens = await RefreshTokenPersistence.findAll();

    return tokens.map((el) => RefreshTokenDomain.create(el.toJSON()));
  }

  async delete(token: string): Promise<void> {
    await RefreshTokenPersistence.destroy({ where: { token } });
  }
}
