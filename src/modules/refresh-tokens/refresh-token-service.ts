import TYPES from "@/types";
import { injectable, inject } from "inversify";
import { RefreshTokenRepository } from "./refresh-token-repository";

@injectable()
export class RefreshTokenService {
  constructor(
    @inject(TYPES.IRefreshTokenRepository) private _refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async deleteExpiredTokens(): Promise<void> {
    await this._refreshTokenRepository.deleteExpiredTokens();
  }
}
