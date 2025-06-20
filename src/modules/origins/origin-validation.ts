import { paginatedSchema } from "../common/validation/pagination-schema";
import { z } from "zod";
import { OriginType } from "./origin-dto";
import { singleUUIDSchema } from "../common/validation/uuid-schema";

export const paginatedOriginSchema = paginatedSchema.extend({
  orderBy: z.optional(
    z.string()
      .refine(value => ['origin', 'type'].includes(value), "Order by must be origin or type")
  )
})

export const createOriginSchema = z.object({
  origin: z.string(),
  type: z.enum([OriginType.HTTP, OriginType.WS]),
  isBlocked: z.boolean(),
})

export const findByIdOriginSchema = z.object({
  id: singleUUIDSchema,
})

export const updateOriginSchema = z.object({
  id: singleUUIDSchema,
}).merge(createOriginSchema);

export const deleteOriginSchema = findByIdOriginSchema;
