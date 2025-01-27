import { singleUUIDSchema } from "@/modules/common/validation/uuid-schema";
import { z } from "zod";

export const createMenuPermissionSchema =  z.object({
  menuId: singleUUIDSchema,
  permissionId: singleUUIDSchema,
  isEnabled: z.boolean(),
})

const permissionSchema = z.object({
  permissionId: singleUUIDSchema,
  isEnabled: z.boolean(),
});

export const bulkUpdateMenuPermissionSchema = z.object({
  menuPermissions: z.array(
    z.object({
      menuId: singleUUIDSchema,
      permissionList: z
        .array(permissionSchema)
        .nonempty('permissionList is required and cannot be empty'), // Ensure permissionList exists and is non-empty
    })
  ),
});
