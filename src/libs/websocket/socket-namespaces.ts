import { Socket } from "socket.io";
import { NamespaceConfig } from ".";

export const socketNamespaces: NamespaceConfig[] = [
  {
    namespace: "/chat",
    events: {
      "message": (socket: Socket, msg: string) => {
        console.log(`message received in /chat, ${msg}`);
        socket.emit("message", msg);
      }
    }
  },
  {
    namespace: "/notifications",
    events: {
      "notify": (socket: Socket, data: any) => {
        console.log(`Notification received in /notifications`);
        socket.broadcast.emit("notify", data);
      }
    }
  }
];
