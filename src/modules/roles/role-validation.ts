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
    z.any()
      .transform(value => typeof value === "string" ? value : undefined)
  )
})
