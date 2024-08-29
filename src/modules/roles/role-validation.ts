import { z } from "zod";

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

export const findOneRoleSchema = z.object({
  id: z
    .string()
    .refine((value) => {
      // Regular expression for validating UUID v7 format
      const uuidV7Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidV7Regex.test(value);
    }, {
      message: "Id must be a valid UUID v7",
    }),
})

export const updateRoleSchema = findOneRoleSchema.extend({
  name:
    z.string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must be at most 255 characters"),
})

export const deleteRoleSchema = findOneRoleSchema;
