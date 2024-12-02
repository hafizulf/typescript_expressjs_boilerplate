import { inject, injectable } from "inversify";
import { SocketNamespace } from "./abstract-namespace";
import { Socket } from "socket.io";
import TYPES from "@/types";
import { AnnouncementService } from "@/modules/announcements/announcement-service";
import { findAllSchema } from "@/modules/announcements/announcement-validation";
import { ANNOUNCEMENT_NSP } from "./namespace-constants";
import { APP_ENV } from "@/config/env";

@injectable()
export class AnnouncementNamespace extends SocketNamespace {
  constructor(
    @inject(TYPES.AnnouncementService) private _announcementService: AnnouncementService,
  ) {
    super(`${ANNOUNCEMENT_NSP}`);
  }

  registerEvents(socket: Socket): void {
    console.log(`Client connected to namespace: ${this.namespace}, socket id: ${socket.id}`);

    socket.on("get_announcements", async (payload) => {
      try {
        console.log("Received payload:", payload);

        const validatedReq = findAllSchema.safeParse(payload);
        const data = await this._announcementService.findAll(validatedReq.data);

        socket.emit("data_announcements", data);
      } catch (error: any) {
          socket.emit("error", {
            message: error.message,
            statusCode: error.statusCode || 500, // Default to 500 if not available
            data: error.data || null,           // Include additional error data if present
            stack: APP_ENV === "development" ? error.stack : undefined, // Stack trace in development only
          });
        }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected from namespace: ${this.namespace}, socket id: ${socket.id}`);
    });
  }
}
