import { Socket } from "socket.io";
import { SocketNamespace } from "./abstract-namespace";
import TYPES from "@/types";
import { DashboardTotalService } from "@/modules/dashboard-totals/dashboard-total-service";
import { inject, injectable } from "inversify";
import { DASHBOARD_TOTAL_NSP } from "./namespace-constants";
import { RateLimiter } from "../rate-limiter";

@injectable()
export class DashboardTotalNamespace extends SocketNamespace {
  private readonly socketIntervals: Map<string, NodeJS.Timeout> = new Map();
  private rateLimiter: RateLimiter;

  constructor(
    @inject(TYPES.DashboardTotalService) private _dashboardTotalService: DashboardTotalService,
  ) {
    super(`${DASHBOARD_TOTAL_NSP}`);
    this.rateLimiter = new RateLimiter(1, 30);
  }

  registerEvents(socket: Socket) {
    console.log(`Client connected to namespace: ${this.namespace}, socket id: ${socket.id}`);

    socket.on("get_total_users", async () => {
      const isAllowed = await this.rateLimiter.checkRateLimit(socket.id);
      if (!isAllowed) {
        socket.emit("error", {
          message: "Rate limit exceeded, please try again later.",
          statusCode: 429,
        });
        return;
      }

      // Emit immediately upon receiving the event
      try {
        const data = await this._dashboardTotalService.findAll();
        socket.emit("data_total_users", data);
      } catch (error) {
        console.error("Failed to fetch dashboard total users immediately:", error);
      }

      // If no interval exists, set one for subsequent emissions
      // Emit data periodically
      if (!this.socketIntervals.has(socket.id)) {
        const interval = setInterval(async () => {
          try {
            const data = await this._dashboardTotalService.findAll();
            socket.emit("data_total_users", data);
          } catch (error) {
            console.error("Failed to fetch dashboard total users in interval:", error);
          }
        }, 60000); // 1 minute

        this.socketIntervals.set(socket.id, interval); // Store the interval for this socket
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected from namespace: ${this.namespace}, socket id: ${socket.id}`);
      const interval = this.socketIntervals.get(socket.id);
      if (interval) {
        clearInterval(interval); // Clear only this socket's interval
        this.socketIntervals.delete(socket.id);
      }
    });
  }
}
