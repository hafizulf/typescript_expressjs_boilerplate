import { z } from "zod";
import { uuidV7RegexSchema } from "../common/validation/uuid-schema";

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

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must be at most 255 characters"),
});

export const findOneRoleSchema = uuidV7RegexSchema;

export const updateRoleSchema = findOneRoleSchema.extend({
  name:
    z.string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must be at most 255 characters"),
})

export const deleteRoleSchema = findOneRoleSchema;
