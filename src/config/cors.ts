import { CorsOptions } from "cors";
import { APP_ENV } from "./env";

// *Add or remove allowed origins as needed
const allowedHttpOrigins = [
  "http://localhost:3001"
];
const allowedWsOrigins = [
  "http://localhost:3001"
];
const isDevelopment = APP_ENV === "development";

export const HttpCorsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (isDevelopment) {
      console.log("Development environment: Allowing all origins");
      return callback(null, true); // Allow all origins in development
    }

    if (!origin) {
      console.error("Blocked by CORS: Missing Origin header in production");
      return callback(new Error("Blocked by CORS: Missing Origin header"));
    }

    if (!allowedHttpOrigins.includes(origin)) {
      console.error(`Blocked by CORS: Origin ${origin} not allowed`);
      return callback(new Error("Blocked by CORS: Origin not allowed"));
    }

    callback(null, true); // Allow valid origins
  },
  credentials: true, // Allow cookies and credentials
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export const WebSocketCorsOption: CorsOptions = {
  origin: (origin, callback) => {
    if (isDevelopment) {
      console.log("Development environment: Allowing all origins");
      return callback(null, true);
    }

    if (!origin) {
      console.error("Blocked by CORS: Missing Origin header in production");
      return callback(new Error("Blocked by CORS: Missing Origin header"));
    }

    if (!allowedWsOrigins.includes(origin)) {
      console.error(`Blocked by CORS: Origin ${origin} not allowed`);
      return callback(new Error("Blocked by CORS: Origin not allowed"));
    }

    callback(null, true);
  },
  credentials: true,
}
