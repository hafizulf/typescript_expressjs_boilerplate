import { Socket } from "socket.io";
import { SocketNamespace } from "./abstract-namespace";
import TYPES from "@/types";
import { DashboardTotalService } from "@/modules/dashboard-totals/dashboard-total-service";
import { inject, injectable } from "inversify";

@injectable()
export class DashboardTotalNamespace extends SocketNamespace {
  constructor(
    @inject(TYPES.DashboardTotalService) private _dashboardTotalService: DashboardTotalService,
  ) {
    super("/dashboard_total");
  }

  registerEvents(socket: Socket) {
    socket.on("get_total_users", async () => {
      try {
        const data = await this._dashboardTotalService.findAll();
        socket.emit("data_total_users", data);
      } catch (error) {
        console.error("Failed to fetch dashboard total users:", error);
      }
    });
  }
}
