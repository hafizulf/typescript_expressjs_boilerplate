import { z } from "zod";
import { paginatedSchema } from "../common/validation/pagination-schema";

export const paginatedUsersSchema = paginatedSchema.extend({
  orderBy: z.optional(
    z.string()
      .refine(
        value => ['fullName', 'email', 'role', 'createdAt'].includes(value),
        "Order by must be fullName, email, role or createdAt"
      )
  )
})
