import { injectable } from "inversify";
import { Socket } from "socket.io";

@injectable()
export class SocketEventWhitelistMiddleware {
  public handle(eventWhitelist: string[]) {
    return (socket: Socket, next: (err?: any) => void): void => {
      socket.onAny((eventName, ..._args) => {
        if (!eventWhitelist.includes(eventName)) {
          console.warn(`Event "${eventName}" is not allowed.`);
          socket.emit("error", { message: `Event "${eventName}" is not allowed.` });
          return;
        }
      });

      next();
    };
  }
}
