const PermissionList = {
  READ: "READ",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  BULK_UPDATE: "BULK UPDATE",
} as const;

type TPermissionList = typeof PermissionList[keyof typeof PermissionList];

export {
  TPermissionList,
  PermissionList,
}

