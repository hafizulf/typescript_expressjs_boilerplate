import { inject, injectable } from "inversify";
import { SocketNamespace } from "./abstract-namespace";
import { Socket } from "socket.io";
import TYPES from "@/types";
import { AnnouncementService } from "@/modules/announcements/announcement-service";
import { findAllSchema } from "@/modules/announcements/announcement-validation";
import { AppError, HttpCode } from "@/exceptions/app-error";

@injectable()
export class AnnouncementNamespace extends SocketNamespace {
  constructor(
    @inject(TYPES.AnnouncementService) private _announcementService: AnnouncementService,
  ) {
    super("/announcement");
  }

  registerEvents(socket: Socket): void {
    console.log(`Client connected to namespace: ${this.namespace}, socket id: ${socket.id}`);

    socket.on("get_announcements", async (payload) => {
      try {
        console.log("Received payload:", payload); //
        const validatedReq = findAllSchema.safeParse(payload);
          if(!validatedReq.success) {
            throw new AppError({
              statusCode: HttpCode.VALIDATION_ERROR,
              description: "Request validation error",
              data: validatedReq.error.flatten().fieldErrors,
            });
          }
        const data = await this._announcementService.findAll(validatedReq.data);
        socket.emit("data_announcements", data);
      } catch (error: any) {
          socket.emit("error", {
            message: error.message,
            statusCode: error.statusCode || 500, // Default to 500 if not available
            data: error.data || null,           // Include additional error data if present
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined, // Stack trace in development only
          });
        }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected from namespace: ${this.namespace}, socket id: ${socket.id}`);
    });
  }
}
