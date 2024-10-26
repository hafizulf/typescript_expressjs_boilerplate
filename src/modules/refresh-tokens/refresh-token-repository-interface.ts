export interface IRefreshTokenRepositoryInterface {
  updateOrCreate(userId: string, refreshToken: string): Promise<void>;
  findOne(userId: string, token: string): Promise<boolean>;
}
