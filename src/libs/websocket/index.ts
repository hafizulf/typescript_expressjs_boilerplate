import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";

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
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    console.log("Socket.IO Initialized.");
  }

  public static initializeNamespaces(namespaceConfigs: NamespaceConfig[]): void {
    namespaceConfigs.forEach((config) => {
      this.createNamespace(config);
    });
  }

  private static createNamespace(config: NamespaceConfig): void {
    const { namespace, events } = config;
    const nsp = this.io.of(namespace);

    nsp.on("connection", (socket: Socket) => {
      console.log(`Client connected to namespace: ${namespace}, socket id: ${socket.id}`);

      // Send an initial welcome message to verify connection
      socket.emit("message", `Welcome to the ${namespace} namespace!`);

      // Register each event dynamically
      Object.entries(events).forEach(([eventName, handler]) => {
        socket.on(eventName, (...args) => {
          console.log(`Event received: ${eventName}, args: ${args}`);
          handler(socket, ...args);
        });
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected from namespace: ${namespace}, socket id: ${socket.id}`);
      });
    });

    console.log(`Namespace created: ${namespace}`);
  }

  public static broadcastMessage(namespace: string, message: string): void {
    const nsp = this.io.of(namespace);
    nsp.emit("message", message);
  }
}
