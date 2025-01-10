import { singleUUIDSchema, uuidV7RegexSchema } from "@/modules/common/validation/uuid-schema";
import { z } from "zod";

export const createMenuSchema = z.object({
  name: z.string(),
  path: z.string(),
  icon: z.string().nullable(),
  parentId: z.string().nullable(),
  isActive: z.boolean(),
});

export const findMenuByIdSchema = uuidV7RegexSchema;

export const updateMenuSchema = z.object({
  id: singleUUIDSchema,
}).merge(createMenuSchema);

export const deleteMenuSchema = uuidV7RegexSchema;
