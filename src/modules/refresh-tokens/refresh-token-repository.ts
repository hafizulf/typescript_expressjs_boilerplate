import { injectable } from "inversify";
import { IRefreshTokenRepositoryInterface } from "./refresh-token-repository-interface";
import { RefreshToken as RefreshTokenPersistence } from "./refresh-token-model";
import { AppError, HttpCode } from "@/exceptions/app-error";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { JWT_REFRESH_SECRET_KEY } from "@/config/env";

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

  async deleteExpiredTokens(): Promise<void> {
    const tokens = await RefreshTokenPersistence.findAll();

    if(tokens.length > 0) {
      for (const row of tokens) {
        try {
          jwt.verify(row.token, JWT_REFRESH_SECRET_KEY);
          console.log("Refresh token not expired:", row.token);
        } catch (error) {
          if (error instanceof TokenExpiredError) {
            await RefreshTokenPersistence.destroy({ where: { token: row.token } });
            console.log(`Expired refresh token deleted: ${row.token}`);
          } else {
            console.error("An error occurred while verifying the token:", error);
          }
        }
      }
    }
  }
}
