export interface IRefreshTokenRepositoryInterface {
  updateOrCreate(userId: string, refreshToken: string): Promise<void>;
}
