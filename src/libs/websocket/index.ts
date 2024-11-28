import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { SocketNamespace } from "./abstract-namespace";
import { inject, injectable } from "inversify";
import TYPES from "@/types";
import { WebAuthService } from "@/modules/authentications/web-auth-service";
import { JWT_SECRET_KEY } from "@/config/env";
import { TokenExpiredError } from "jsonwebtoken";

export interface NamespaceConfig {
  namespace: string;
  events: Record<string, CallableFunction>;
}

@injectable()
export class SocketIO {
  private io!: SocketIOServer;

  constructor(
    @inject(TYPES.WebAuthService) private _webAuthService: WebAuthService,
  ) {}

  public initialize(httpServer: HttpServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*", // *change this to your frontend url
        methods: ["GET", "POST"],
      },
    });

    this.addAuthenticationMiddleware(this.io);

    console.log("Socket.IO Initialized.");
  }

  private addAuthenticationMiddleware(nsp: SocketIOServer | ReturnType<SocketIOServer['of']>): void {
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
    const nsp = this.io.of(namespaceInstance.namespace);

    this.addAuthenticationMiddleware(nsp); // Attach authentication middleware

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

