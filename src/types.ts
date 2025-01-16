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
  ManageDbTransactionService: Symbol.for("ManageDbTransactionService"),
  MenuPermissionService: Symbol.for("MenuPermissionService"),
  MenuService: Symbol.for("MenuService"),
  MqttService: Symbol.for("MqttService"),
  PermissionService: Symbol.for("PermissionService"),
  RefreshTokenService: Symbol.for("RefreshTokenService"),
  RoleService: Symbol.for("RoleService"),
  UserService: Symbol.for("UserService"),
  UserLogsService: Symbol.for("UserLogsService"),
  WebAuthService: Symbol.for("WebAuthService"),

  // Repository Interface
  IAnnouncementRepository: Symbol.for("IAnnouncementRepository"),
  IDashboardTotalRepository: Symbol.for("IDashboardTotalRepository"),
  IMenuPermissionRepository: Symbol.for("IMenuPermissionRepository"),
  IMenuRepository: Symbol.for("IMenuRepository"),
  IPermissionRepository: Symbol.for("IPermissionRepository"),
  IRefreshTokenRepository: Symbol.for("IRefreshTokenRepository"),
  IRoleRepository: Symbol.for("IRoleRepository"),
  IUserRepository: Symbol.for("IUserRepository"),
  IUserLogsRepository: Symbol.for("IUserLogsRepository"),

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
