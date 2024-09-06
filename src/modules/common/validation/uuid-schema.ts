import { z } from "zod";

export const uuidV7RegexSchema = z.object({
  id: z
    .string()
    .refine((value) => {
      // Regular expression for validating UUID v7 format
      const uuidV7Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidV7Regex.test(value);
    }, {
      message: "Id must be a valid UUID",
    }),
})

export const singleUUIDSchema = z
  .string()
  .refine((value) => {
    // Regular expression for validating UUID v7 format
    const uuidV7Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV7Regex.test(value);
  }, {
    message: "Id must be a valid UUID",
  });
