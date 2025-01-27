import { singleUUIDSchema } from "@/modules/common/validation/uuid-schema";
import { z } from "zod";

export const findRoleMenuPermissionSchema = z.object({
  roleId: singleUUIDSchema,
})
