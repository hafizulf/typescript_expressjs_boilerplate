import { injectable } from "inversify";
import { Socket } from "socket.io";

@injectable()
export abstract class SocketNamespace {
  public readonly namespace: string;
  public allowedRoles: string[];

  constructor(namespace: string, allowedRoles: string[] = []) {
    this.namespace = namespace;
    this.allowedRoles = allowedRoles;
  }

  abstract registerEvents(socket: Socket): void;
}
