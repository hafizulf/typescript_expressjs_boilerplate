const PermissionList = {
  READ: "READ",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
} as const;

type TPermissionList = typeof PermissionList[keyof typeof PermissionList];

export {
  TPermissionList,
  PermissionList,
}

