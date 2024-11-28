import { Socket } from "socket.io";
import { SocketNamespace } from "./abstract-namespace";
import { PUBLIC_TIME_NSP } from "./namespace-constants";

export class PublicTimeNamespace extends SocketNamespace {
  constructor() {
    super(`${PUBLIC_TIME_NSP}`);
  }

  registerEvents(socket: Socket): void {
    socket.on("get_time", async () => {
      try {
        const time = new Date().toLocaleString();
        const data = { time };

        socket.emit("data_time", data);
      } catch (error: any) {
        socket.emit("error", {
          message: error.message,
          statusCode: error.statusCode || 500,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
      }
    });
  }
}
