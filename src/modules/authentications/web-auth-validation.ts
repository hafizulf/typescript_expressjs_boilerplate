import { z } from "zod";

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export const generateAccessTokenSchema = z.object({
  refreshToken: z.string(),
})

export const logoutSchema = generateAccessTokenSchema;
