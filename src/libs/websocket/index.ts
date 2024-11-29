import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { SocketNamespace } from "./namespaces/abstract-namespace";
import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { WebAuthService } from "@/modules/authentications/web-auth-service";
import { JWT_SECRET_KEY } from "@/config/env";
import { TokenExpiredError } from "jsonwebtoken";
import { WebSocketCorsOption } from "@/config/cors";

export interface NamespaceConfig {
  namespace: string;
  events: Record<string, CallableFunction>;
}

@injectable()
export class SocketIO {
  private io!: SocketIOServer;
  private publicNamespaces: string[] = [];

  constructor(
    @inject(TYPES.WebAuthService) private _webAuthService: WebAuthService,
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

  private addAuthenticationMiddleware(
    nsp: SocketIOServer | ReturnType<SocketIOServer['of']>,
    namespace: string
  ): void {
    if(this.publicNamespaces.includes(namespace)) return; // skip auth for public namespace

    nsp.use(async (socket: Socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) {
        console.error("No token provided, rejecting connection.");
        return next(new Error("Authentication error: No token provided"));
      }

      try {
        const user = await this._webAuthService.getMe(token, JWT_SECRET_KEY);
        socket.data.user = user; // Attach user to socket instance
        next(); // Allow connection
      } catch (error) {
        console.error("Invalid token, rejecting connection.");
        if (error instanceof TokenExpiredError) {
          return next(new Error("Authentication error: Token has been expired"));
        } else {
          return next(new Error("Authentication error: Invalid token"));
        }
      }
    });
  }

  public initializeNamespaces(namespaces: SocketNamespace[]): void {
    namespaces.forEach((namespace) => {
      this.createNamespace(namespace);
    });
  }

  private createNamespace(namespaceInstance: SocketNamespace): void {
    const namespace = namespaceInstance.namespace;
    const nsp = this.io.of(namespace);

    this.addAuthenticationMiddleware(nsp, namespace); // Attach authentication middleware

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

