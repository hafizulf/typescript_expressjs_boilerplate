const TYPES = {
  HTTPRouter: Symbol.for("HTTPRouter"),
  Server: Symbol.for("Server"),
  Routes: Symbol.for("Routes"),
  SocketIO: Symbol.for("SocketIO"),
  Logger: Symbol.for("Logger"),
  Database: Symbol.for("Database"),

  // Service
  WebAuthService: Symbol.for("WebAuthService"),
  RoleService: Symbol.for("RoleService"),
  UserService: Symbol.for("UserService"),
  RefreshTokenService: Symbol.for("RefreshTokenService"),
  DashboardTotalService: Symbol.for("DashboardTotalService"),

  // Repository Interface
  IRoleRepository: Symbol.for("IRoleRepository"),
  IUserRepository: Symbol.for("IUserRepository"),
  IRefreshTokenRepository: Symbol.for("IRefreshTokenRepository"),
  IDashboardTotalRepository: Symbol.for("IDashboardTotalRepository"),

  // Socket Namespaces
  DashboardTotalNamespace: Symbol.for("DashboardTotalNamespace"),
}

export default TYPES;
