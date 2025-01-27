import { paginatedSchema } from "@/modules/common/validation/pagination-schema";
import { singleUUIDSchema } from "@/modules/common/validation/uuid-schema";
import { z } from "zod";

export const paginatedMenuPermissionSchema = paginatedSchema.extend({
  orderBy: z.optional(
    z
      .string()
      .refine(
        (value) => ['menu', 'permission'].includes(value),
        'Order by must be menu or permission'
      )
  ),
});

export const createMenuPermissionSchema =  z.object({
  menuId: singleUUIDSchema,
  permissionId: singleUUIDSchema,
  isEnabled: z.boolean(),
})

export const findMenuPermissionByIdSchema = z.object({
  id: singleUUIDSchema,
});

export const updateMenuPermissionSchema = z.object({
  id: singleUUIDSchema,
  isEnabled: z.boolean(),
});

export const deleteMenuPermissionSchema = findMenuPermissionByIdSchema;

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
