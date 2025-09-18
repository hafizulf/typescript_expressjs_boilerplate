import { injectable } from "inversify";
import { IRefreshTokenRepository } from "./refresh-token-repository-interface";
import { RefreshToken as RefreshTokenPersistence } from "@/modules/common/sequelize";
import { AppError, HttpCode } from "@/exceptions/app-error";
import { RefreshTokenDomain } from "./refresh-token-domain";
import { TokenErrMessage } from "@/exceptions/error-message-constants";

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  async updateOrCreate(userId: string, refreshToken: string): Promise<void> {
    const data = await RefreshTokenPersistence.findOne({ where: { userId } });
    if (data) {
      data.token = refreshToken;
      data.updatedAt = new Date();
      data.isRevoked = false;
      await data.save();
    } else {
      await RefreshTokenPersistence.create({ 
        userId, 
        token: refreshToken, 
        isRevoked: false,
        createdAt: new Date() 
      });
    }
  }

  async findOne(userId: string, token: string): Promise<boolean> {
    const data = await RefreshTokenPersistence.findOne({ where: { userId, token, isRevoked: false } });
    // return !!data; // return true if data exists
    if(!data) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: TokenErrMessage.REFRESH_TOKEN_NOT_FOUND,
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

  async revoke(userId: string): Promise<RefreshTokenDomain> {
    const row = await RefreshTokenPersistence.findOne({ where: { userId } });
    if(!row) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: TokenErrMessage.REFRESH_TOKEN_NOT_FOUND,
      })
    }
    row.isRevoked = true;
    await row.save();

    return RefreshTokenDomain.create(row.toJSON());
  }
}
