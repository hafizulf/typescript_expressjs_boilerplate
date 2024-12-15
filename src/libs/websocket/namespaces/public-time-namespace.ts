import { Socket } from "socket.io";
import { SocketNamespace } from "./abstract-namespace";
import { PUBLIC_TIME_NSP } from "./constants/namespace-constants";
import { APP_ENV } from "@/config/env";
import { RateLimiter } from "../rate-limiter";
import { PUBLIC_TIME_EVENTS } from "./constants/event-constants";

export class PublicTimeNamespace extends SocketNamespace {
  private rateLimiter: RateLimiter;

  constructor() {
    super(PUBLIC_TIME_NSP, [], [
      PUBLIC_TIME_EVENTS.GET_TIME,
      PUBLIC_TIME_EVENTS.DATA_TIME,
    ]);
    this.rateLimiter = new RateLimiter(5, 60); // max 5 requests per minute
  }

  registerEvents(socket: Socket): void {
    socket.on("get_time", async () => {
      const isAllowed = await this.rateLimiter.checkRateLimit(socket.id);
      if(!isAllowed) {
        socket.emit("error", {
          message: "Too many requests. Please try again later.",
          statusCode: 429,
        });
        return; // stop further processing
      }

      try {
        const time = new Date().toLocaleString();
        const data = { time };

        socket.emit("data_time", data);
      } catch (error: any) {
        socket.emit("error", {
          message: error.message,
          statusCode: error.statusCode || 500,
          stack: APP_ENV === "development" ? error.stack : undefined,
        });
      }
    });

    socket.on("connection_error", (error: any) => {
      socket.emit("error", error);
    })
  }
}
