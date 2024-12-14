import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { SocketNamespace } from "./namespaces/abstract-namespace";
import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { WebSocketCorsOption } from "@/config/cors";
import { SocketAuthenticationMiddleware } from "./middlewares/socket-authentication-middleware";
import { SocketAuthorizationMiddleware } from "./middlewares/socket-authorization-middleware";

export interface NamespaceConfig {
  namespace: string;
  events: Record<string, CallableFunction>;
}

@injectable()
export class SocketIO {
  private io!: SocketIOServer;
  private publicNamespaces: string[] = [];

  constructor(
    @inject(TYPES.SocketAuthenticationMiddleware) private _socketAuthenticationMiddleware: SocketAuthenticationMiddleware,
    @inject(TYPES.SocketAuthorizationMiddleware) private _socketAuthorizationMiddleware: SocketAuthorizationMiddleware,
  ) {}

  public initialize(httpServer: HttpServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: WebSocketCorsOption,
    });

    console.log("Socket.IO Initialized.");
  }

  public setPublicNamespaces(namespaces: string[]): void {
    this.publicNamespaces = namespaces;
  }

  public initializeNamespaces(namespaces: SocketNamespace[]): void {
    namespaces.forEach((namespace) => {
      this.createNamespace(namespace);
    });
  }

  private createNamespace(namespaceInstance: SocketNamespace): void {
    const namespace = namespaceInstance.namespace;
    const allowedRoles = namespaceInstance.allowedRoles;
    const nsp = this.io.of(namespace);

    nsp.use(this._socketAuthenticationMiddleware.handle(this.publicNamespaces)); // Add authentication middleware
    if (allowedRoles.length > 0) { // Add authorization middleware if roles are defined
      nsp.use(this._socketAuthorizationMiddleware.handle(this.publicNamespaces, allowedRoles));
    }

    nsp.on("connection", (socket: Socket) => {
      console.log(`Client connected to namespace: ${namespaceInstance.namespace}, socket id: ${socket.id}`);

      socket.emit("message", `Welcome to the ${namespaceInstance.namespace} namespace!`);

      namespaceInstance.registerEvents(socket);

      socket.on("disconnect", () => {
        console.log(`Client disconnected from namespace: ${namespaceInstance.namespace}, socket id: ${socket.id}`);
      });
    });

    console.log(`Socket with namespace: ${namespaceInstance.namespace} created.`);
  }

  public getNamespace(namespace: string) {
    return this.io.of(namespace); // Access the actual `SocketIOServer` instance
  }

  public broadcastMessage(namespace: string, event: string, message: string): void {
    const nsp = this.getNamespace(namespace);
    nsp.emit(event, message);
  }
}

