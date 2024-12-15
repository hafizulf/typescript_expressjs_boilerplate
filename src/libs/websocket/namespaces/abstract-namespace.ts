import { injectable } from "inversify";
import { Socket } from "socket.io";

@injectable()
export abstract class SocketNamespace {
  public readonly namespace: string;
  public allowedRoles: string[];
  public eventWhitelist: string[];

  constructor(
    namespace: string,
    allowedRoles: string[] = [],
    eventWhitelist: string[] = []
  ) {
    this.namespace = namespace;
    this.allowedRoles = allowedRoles;
    this.eventWhitelist = eventWhitelist;
  }

  abstract registerEvents(socket: Socket): void;
}
