import { z } from "zod";
import { uuidV7RegexSchema } from "../common/validation/uuid-schema";
import { EnumRoles } from "../common/const/role-constants";
import { paginatedSchema } from "../common/validation/pagination-schema";

export const paginatedRoleSchema = paginatedSchema.extend({
  orderBy: z.optional(
    z.string()
      .refine(value => ['name', 'createdAt'].includes(value), "Order by must be name or createdAt")
  )
})

export const findOneRoleSchema = uuidV7RegexSchema;

// Create or update role required updating enum roles
export const createRoleSchema = z.object({
  name: z.nativeEnum(EnumRoles).describe("Role must be one of the predefined roles"),
});

export const updateRoleSchema = findOneRoleSchema.extend({
  name: z.nativeEnum(EnumRoles).describe("Role must be one of the predefined roles"),
})

export const deleteRoleSchema = findOneRoleSchema;
