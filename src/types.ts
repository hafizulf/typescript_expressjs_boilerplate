const TYPES = {
  HTTPRouter: Symbol.for("HTTPRouter"),
  Server: Symbol.for("Server"),
  Logger: Symbol.for("Logger"),
  Database: Symbol.for("Database"),

  // Service
  WebAuthService: Symbol.for("WebAuthService"),
  RoleService: Symbol.for("RoleService"),
  UserService: Symbol.for("UserService"),

  // Repository Interface
  IRoleRepository: Symbol.for("IRoleRepository"),
  IUserRepository: Symbol.for("IUserRepository"),
}

export default TYPES;
