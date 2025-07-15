import { OriginService } from "@/modules/origins/origin-service";
import { APP_ENV } from "./env";
import { OriginType } from "@/modules/origins/origin-dto";
import { CorsOptions } from "cors";

const isDevelopment = APP_ENV === "development";

export const createCorsOptions = async (
  originService: OriginService,
  type: OriginType,
): Promise<CorsOptions> => {
  const allowedOrigins = (await originService.findAllByType(type)).map((el) => el.origin);
  console.log(`ALLOWED ${type} ORIGINS: `, allowedOrigins);

  return {
    origin: (origin, callback) => {
      console.log("REQUEST ORIGIN:", origin);

      if (isDevelopment) {
        console.log("Development mode: Allowing all origins");
        return callback(null, true);
      }

      if (!origin) {
        console.warn("No origin header — possibly Postman or internal request. Allowing.");
        return callback(null, true); // Allow when Origin header is missing
      }

      if (!allowedOrigins.includes(origin)) {
        console.error(`Blocked by CORS: Origin ${origin} not allowed`);
        return callback(new Error("Blocked by CORS: Origin not allowed"));
      }

      console.log("Origin passed CORS check:", origin);
      return callback(null, true);
    },
    credentials: true,
    ...(type === OriginType.HTTP && {
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  };
};
