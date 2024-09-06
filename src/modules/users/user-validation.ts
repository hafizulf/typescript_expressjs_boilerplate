import { z } from "zod";
import { paginatedSchema } from "../common/validation/pagination-schema";
import { IMulterFile } from "../common/interfaces/multer-interface";
import { singleUUIDSchema, uuidV7RegexSchema } from "../common/validation/uuid-schema";

export const paginatedUsersSchema = paginatedSchema.extend({
  orderBy: z.optional(
    z.string()
      .refine(
        value => ['fullName', 'email', 'role', 'createdAt'].includes(value),
        "Order by must be fullName, email, role or createdAt"
      )
  )
})

export const createUserSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol"),
  roleId: singleUUIDSchema,
  avatarPath: z.any().nullable().transform((val) => <IMulterFile>val)
});

export const findByIdUserSchema = uuidV7RegexSchema;

export const updateUserSchema = z.object({
  id: singleUUIDSchema,
  fullName: z.string(),
  email: z.string().email(),
  roleId: singleUUIDSchema,
  avatarPath: z
    .any()
    .nullish()
    .refine((val) => typeof val === "object" || !val, "Avatar is required")
    .transform((val) => <IMulterFile>val),
});

export const deleteUserSchema = uuidV7RegexSchema;
