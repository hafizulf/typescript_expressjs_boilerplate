import { singleUUIDSchema, uuidV7RegexSchema } from "@/modules/common/validation/uuid-schema";
import { z } from "zod";

export const createPermissionSchema = z.object({
  name: z.string(),
});

export const findPermissionByIdSchema = uuidV7RegexSchema;

export const updatePermissionSchema = z.object({
  id: singleUUIDSchema,
}).merge(createPermissionSchema);

export const deletePermissionSchema = uuidV7RegexSchema;
