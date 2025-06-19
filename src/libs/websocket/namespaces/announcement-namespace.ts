import { inject, injectable } from "inversify";
import { SocketNamespace } from "./abstract-namespace";
import { Socket } from "socket.io";
import TYPES from "@/types";
import { AnnouncementService } from "@/modules/announcements/announcement-service";
import { findAllSchema } from "@/modules/announcements/announcement-validation";
import { ANNOUNCEMENT_NSP } from "./constants/namespace-constants";
import { APP_ENV } from "@/config/env";
import { RateLimiter } from "../rate-limiter";
import { ADMIN, SUPERADMIN, USER } from "@/modules/common/const/role-constants";
import { ANNOUNCEMENT_EVENTS } from "./constants/event-constants";

@injectable()
export class AnnouncementNamespace extends SocketNamespace {
  private rateLimiter: RateLimiter;

  constructor(
    @inject(TYPES.AnnouncementService) private _announcementService: AnnouncementService,
  ) {
    super(ANNOUNCEMENT_NSP, [SUPERADMIN, ADMIN, USER], [
      ANNOUNCEMENT_EVENTS.GET_ANNOUNCEMENTS,
      ANNOUNCEMENT_EVENTS.DATA_ANNOUNCEMENTS,
    ]);
    this.rateLimiter = new RateLimiter(100, 60);
  }

  registerEvents(socket: Socket): void {
    socket.on(ANNOUNCEMENT_EVENTS.GET_ANNOUNCEMENTS, async (payload) => {
      const isAllowed = await this.rateLimiter.checkRateLimit(socket.handshake.address);
      if (!isAllowed) {
        socket.emit("error", {
          message: "Rate limit exceeded, please try again later.",
          statusCode: 429,
        });
        return;
      }

      try {
        console.log("Received payload:", payload);

        const validatedReq = findAllSchema.safeParse(payload);
        const data = await this._announcementService.findAll(validatedReq.data);

        socket.emit(ANNOUNCEMENT_EVENTS.DATA_ANNOUNCEMENTS, data);
      } catch (error: any) {
          socket.emit("error", {
            message: error.message,
            statusCode: error.statusCode || 500, // Default to 500 if not available
            data: error.data || null,           // Include additional error data if present
            stack: APP_ENV === "development" ? error.stack : undefined, // Stack trace in development only
          });
        }
    });
  }
}
