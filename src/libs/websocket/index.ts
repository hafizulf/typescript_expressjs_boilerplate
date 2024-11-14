import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { SocketNamespace } from "./abstract-namespace";

export interface NamespaceConfig {
  namespace: string;
  events: Record<string, CallableFunction>;
}

export class SocketIO {
  private static io: SocketIOServer;

  constructor() {}

  public static initialize(httpServer: HttpServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*", // *change this to your frontend url
        methods: ["GET", "POST"],
      },
    });

    console.log("Socket.IO Initialized.");
  }

  public static initializeNamespaces(namespaces: SocketNamespace[]): void {
    namespaces.forEach((namespace) => {
      this.createNamespace(namespace);
    });
  }

  private static createNamespace(namespaceInstance: SocketNamespace): void {
    const nsp = this.io.of(namespaceInstance.namespace);

    nsp.on("connection", (socket: Socket) => {
      console.log(`Client connected to namespace: ${namespaceInstance.namespace}, socket id: ${socket.id}`);
      socket.emit("message", `Welcome to the ${namespaceInstance.namespace} namespace!`); // Send a welcome message on connection

      namespaceInstance.registerEvents(socket); // Register events specific to this namespace instance

      socket.on("disconnect", () => {
        console.log(`Client disconnected from namespace: ${namespaceInstance.namespace}, socket id: ${socket.id}`);
      });
    });

    console.log(`Socket with namespace: ${namespaceInstance.namespace} created.`);
  }

  public static broadcastMessage(namespace: string, message: string): void {
    const nsp = this.io.of(namespace);
    nsp.emit("message", message);
  }
}
