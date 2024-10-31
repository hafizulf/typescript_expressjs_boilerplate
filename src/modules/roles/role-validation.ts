import { z } from "zod";
import { uuidV7RegexSchema } from "../common/validation/uuid-schema";
import { EnumRoles } from "../common/const/role-constants";

const optionalPositiveIntSchema = z.optional(
  z
    .any()
    .refine((val) => parseInt(val) > -1, "Value must be a number")
    .transform((val) => (parseInt(val) > 0 ? parseInt(val) : undefined))
);

export const paginatedSchema = z.object({
  search: z.optional(
    z.any()
      .transform(value => typeof value === "string" ? value : "")
  ),
  page: optionalPositiveIntSchema,
  limit: optionalPositiveIntSchema,
  sort: z.optional(
    z.string()
      .refine(value => ['ASC', 'DESC'].includes(value), "Sort must be ASC or DESC")
  ),
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
