import { inject, injectable } from "inversify";
import { NamespaceConfigService } from "./namespaces/namespace-config-service";
import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { SocketNamespace } from "./namespaces/abstract-namespace";
import TYPES from "@/types";
import { SocketAuthenticationMiddleware } from "./middlewares/socket-authentication-middleware";
import { SocketAuthorizationMiddleware } from "./middlewares/socket-authorization-middleware";
import { SocketEventWhitelistMiddleware } from "./middlewares/socket-event-whitelist-middleware";
import { WebSocketCorsOption } from "@/config/cors";

@injectable()
export class SocketIO {
  private io!: SocketIOServer;

  constructor(
    @inject(TYPES.NamespaceConfigService)
    private namespaceConfig: NamespaceConfigService,
    @inject(TYPES.SocketAuthenticationMiddleware)
    private _authenticationMiddleware: SocketAuthenticationMiddleware,
    @inject(TYPES.SocketAuthorizationMiddleware)
    private _authorizationMiddleware: SocketAuthorizationMiddleware,
    @inject(TYPES.SocketEventWhitelistMiddleware)
    private _eventWhitelistMiddleware: SocketEventWhitelistMiddleware,
  ) {}

  public initialize(httpServer: HttpServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: WebSocketCorsOption,
    });

    console.log("Socket.IO Initialized.");
  }

  public setPublicNamespaces(namespaces: string[]): void {
    this.namespaceConfig.setPublicNamespaces(namespaces); // Set public namespaces
  }

  public initializeNamespaces(namespaces: SocketNamespace[]): void {
    namespaces.forEach((namespace) => {
      this.createNamespace(namespace);
    });
  }

  private createNamespace(namespaceInstance: SocketNamespace): void {
    const namespace = namespaceInstance.namespace;
    const allowedRoles = namespaceInstance.allowedRoles;
    const eventWhitelist = namespaceInstance.eventWhitelist;
    const nsp = this.io.of(namespace);

    nsp.use(this._authenticationMiddleware.handle()); // Add authentication middleware
    if (allowedRoles.length > 0) { // Add authorization middleware if roles are defined
      nsp.use(this._authorizationMiddleware.handle(allowedRoles));
    }
    nsp.use(this._eventWhitelistMiddleware.handle(eventWhitelist)); // Add event whitelist middleware

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

