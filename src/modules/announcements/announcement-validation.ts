import { z } from "zod";
import { uuidV7RegexSchema } from "../common/validation/uuid-schema";
import { validateDateString } from "../common/validation/date-schema";
import { AppError, HttpCode } from "@/exceptions/app-error";

export const createAnnouncementSchema = z.object({
  title: z.string(),
  content: z.string(),
})

export const findByIdSchema = uuidV7RegexSchema;

export const findAllSchema = z.object({
  from: z.preprocess((val) => {
    if (!val || typeof val !== "string") return undefined; // Ensure val is a string
    try {
      return validateDateString(val); // Convert valid string to Date
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Invalid date / format in 'from' field",
      });
    }
  }, z.date().optional()),

  to: z.preprocess((val) => {
    if (!val || typeof val !== "string") return undefined;
    try {
      return validateDateString(val);
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Invalid date / format in 'to' field",
      });
    }
  }, z.date().optional()),

});
