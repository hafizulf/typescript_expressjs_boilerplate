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
  console.log(`ALLOWED ${type} ORIGINS:`, allowedOrigins);

  // For WebSocket, include corresponding HTTP origins
  const wsHttpOrigins = type === OriginType.WS
    ? (await originService.findAllByType(OriginType.HTTP)).map((el) => el.origin)
    : [];
  const allAllowedOrigins = [...allowedOrigins, ...wsHttpOrigins];
  console.log(`ALL ALLOWED ${type} ORIGINS (including HTTP for WS):`, allAllowedOrigins);

  return {
    origin: (origin, callback) => {
      if (!origin) {
        console.warn("No origin header — possibly Postman or internal request. Allowing.");
        return callback(null, true);
      }

      if (isDevelopment) {
        return callback(null, true);
      }

      // Normalize origins for comparison (to handle ws:// vs http://)
      const normalizedOrigin = origin.replace(/^ws/, 'http');
      const match = allAllowedOrigins.includes(origin) || allAllowedOrigins.includes(normalizedOrigin);
      console.log("Comparing origin:", { received: origin, allowedOrigins: allAllowedOrigins, match });

      if (!match) {
        console.error(`Blocked by CORS: Origin ${origin} not allowed`);
        return callback(new Error("Blocked by CORS: Origin not allowed"));
      }

      return callback(null, true);
    },
    credentials: true,
    ...(type === OriginType.HTTP && {
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  };
};
