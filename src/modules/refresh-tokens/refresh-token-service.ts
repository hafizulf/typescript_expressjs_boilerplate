import TYPES from "@/types";
import { injectable, inject } from "inversify";
import { RefreshTokenRepository } from "./refresh-token-repository";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET_KEY } from "@/config/env";
import { TokenExpiredError } from "jsonwebtoken";

@injectable()
export class RefreshTokenService {
  constructor(
    @inject(TYPES.IRefreshTokenRepository) private _refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async deleteExpiredTokens(): Promise<void> {
    const tokens = await this._refreshTokenRepository.findAll();

    if (tokens.length > 0) {
      for (const el of tokens) {
        try {
          jwt.verify(el.token, JWT_REFRESH_SECRET_KEY);
        } catch (error) {
          if (error instanceof TokenExpiredError) {
            await this._refreshTokenRepository.delete(el.token);
            console.log(`Expired refresh token deleted: ${el.token}`);
          } else {
            console.error("An error occurred while verifying the token:", error);
          }
        }
      }
    }
  }
}
