import { singleUUIDSchema } from "@/modules/common/validation/uuid-schema";
import { z } from "zod";

export const findRoleMenuPermissionSchema = z.object({
  roleId: singleUUIDSchema,
})

const permissionSchema = z.object({
  permissionId: singleUUIDSchema,
  isPermitted: z.boolean(),
});

export const bulkUpdateRoleMenuPermissionSchema = z.object({
  roleId: singleUUIDSchema,
  menus: z.array(
    z.object({
      menuId: singleUUIDSchema,
      permissionList: z
        .array(permissionSchema)
        .nonempty({ message: 'permissionList is required and cannot be empty' })
    })
  )
})

export const createRoleMenuPermissionSchema = z.object({
  roleId: singleUUIDSchema,
  menuId: singleUUIDSchema,
  permissionId: singleUUIDSchema,
});
