const TYPES = {
  HTTPRouter: Symbol.for("HTTPRouter"),
  Server: Symbol.for("Server"),
  Logger: Symbol.for("Logger"),
  Database: Symbol.for("Database"),

  // Service
  RoleService: Symbol.for("RoleService"),

  // Repository Interface
  IRoleRepository: Symbol.for("IRoleRepository"),
}

export default TYPES;
