export enum TokenErrMessage {
  INVALID = 'Invalid token',
  INVALID_PAYLOAD_EXP = 'Invalid token payload (no exp)',
  MISSING = 'Token is missing',
  EXPIRED = 'Token has been expired',
}

export enum UserErrMessage {
  NOT_FOUND = 'User not found',
  ALREADY_EXISTS = 'User already exists',
  EMAIL_ALREADY_EXISTS = 'Email already exists',
}

export enum RoleErrMessage {
  NOT_FOUND = 'Role not found',
  ALREADY_EXISTS = 'Role already exists',
}

export enum MenuErrMessage {
  NOT_FOUND = 'Menu not found',
  ALREADY_EXISTS = 'Menu name already exists',
}

export enum PermissionErrMessage {
  NOT_FOUND = 'Permission not found',
  ALREADY_EXISTS = 'Permission name already exists',
}

export enum MenuPermissionErrMessage {
  NOT_FOUND = 'Menu permission not found',
  ALREADY_EXISTS = 'Menu permission already exists',
  IS_DISABLED = 'Menu permission is disabled',
}

export enum RoleMenuPermissionErrMessage {
  NOT_FOUND = 'Role menu permission not found',
  ALREADY_EXISTS = 'Role menu permission already exists',
}
