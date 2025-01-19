import { singleUUIDSchema } from "@/modules/common/validation/uuid-schema";
import { z } from "zod";

export const createMenuPermissionSchema =  z.object({
  menuId: singleUUIDSchema,
  permissionId: singleUUIDSchema,
  isEnabled: z.boolean(),
})
