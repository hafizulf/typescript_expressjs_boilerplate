const TYPES = {
  HTTPRouter: Symbol.for("HTTPRouter"),
  Server: Symbol.for("Server"),
  Logger: Symbol.for("Logger"),
  Database: Symbol.for("Database"),

  // Service
  WebAuthService: Symbol.for("WebAuthService"),
  RoleService: Symbol.for("RoleService"),
  UserService: Symbol.for("UserService"),
  RefreshTokenService: Symbol.for("RefreshTokenService"),

  // Repository Interface
  IRoleRepository: Symbol.for("IRoleRepository"),
  IUserRepository: Symbol.for("IUserRepository"),
  IRefreshTokenRepository: Symbol.for("IRefreshTokenRepository"),
}

export default TYPES;
