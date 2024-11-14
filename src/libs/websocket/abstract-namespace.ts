import { injectable } from "inversify";
import { Socket } from "socket.io";

@injectable()
export abstract class SocketNamespace {
  namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  abstract registerEvents(socket: Socket): void;
}
