const TYPES = {
  Bootstrap: Symbol.for("Bootstrap"),
  Database: Symbol.for("Database"),
  HTTPRouter: Symbol.for("HTTPRouter"),
  Logger: Symbol.for("Logger"),
  Routes: Symbol.for("Routes"),
  Server: Symbol.for("Server"),
  SocketIO: Symbol.for("SocketIO"),

  // Service
  AnnouncementService: Symbol.for("AnnouncementService"),
  BackgroundServiceManager: Symbol.for("BackgroundServiceManager"),
  DashboardTotalService: Symbol.for("DashboardTotalService"),
  WebAuthService: Symbol.for("WebAuthService"),
  RefreshTokenService: Symbol.for("RefreshTokenService"),
  RoleService: Symbol.for("RoleService"),
  UserService: Symbol.for("UserService"),

  // Repository Interface
  IAnnouncementRepository: Symbol.for("IAnnouncementRepository"),
  IDashboardTotalRepository: Symbol.for("IDashboardTotalRepository"),
  IRefreshTokenRepository: Symbol.for("IRefreshTokenRepository"),
  IRoleRepository: Symbol.for("IRoleRepository"),
  IUserRepository: Symbol.for("IUserRepository"),

  // Socket Namespaces
  NamespaceConfigService: Symbol.for("NamespaceConfigService"),
  AnnouncementNamespace: Symbol.for("AnnouncementNamespace"),
  DashboardTotalNamespace: Symbol.for("DashboardTotalNamespace"),

  // Socket Middleware
  SocketAuthenticationMiddleware: Symbol.for("SocketAuthenticationMiddleware"),
  SocketAuthorizationMiddleware: Symbol.for("SocketAuthorizationMiddleware"),
  SocketEventWhitelistMiddleware: Symbol.for("SocketEventWhitelistMiddleware"),
}

export default TYPES;
