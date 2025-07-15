import { inject, injectable } from "inversify";
import { NamespaceConfigService } from "./namespaces/namespace-config-service";
import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { SocketNamespace } from "./namespaces/abstract-namespace";
import TYPES from "@/types";
import { SocketAuthenticationMiddleware } from "./middlewares/socket-authentication-middleware";
import { SocketAuthorizationMiddleware } from "./middlewares/socket-authorization-middleware";
import { SocketEventWhitelistMiddleware } from "./middlewares/socket-event-whitelist-middleware";
import { OriginService } from "@/modules/origins/origin-service";
import { createCorsOptions } from "@/config/cors-option";
import { OriginType } from "@/modules/origins/origin-dto";

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
    @inject(TYPES.OriginService)
    private originService: OriginService,
  ) {}

  public async initialize(httpServer: HttpServer): Promise<void> {
    const wsCorsOptions = await createCorsOptions(this.originService, OriginType.WS);

    this.io = new SocketIOServer(httpServer, {
      cors: wsCorsOptions,
    });
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
      console.log(`Client connected to namespace: ${namespace}, socket id: ${socket.id}`);

      socket.emit("message", `Welcome to the ${namespace} namespace!`);

      namespaceInstance.registerEvents(socket);

      socket.on("disconnect", () => {
        console.log(`Client disconnected from namespace: ${namespace}, socket id: ${socket.id}`);
      });
    });

    console.log(`Socket with namespace: ${namespace} created.`);
  }

  public getNamespace(namespace: string) {
    return this.io.of(namespace); // Access the actual `SocketIOServer` instance
  }

  public broadcastMessage(namespace: string, event: string, message: string): void {
    const nsp = this.getNamespace(namespace);
    nsp.emit(event, message);
  }
}

