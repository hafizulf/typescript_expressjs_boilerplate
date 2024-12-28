import { inject, injectable } from "inversify";
import { Cron } from "@/libs/cron-job/cron";
import { Role, User, RefreshToken, DashboardTotal, Announcement, UserLogs } from "@/modules/common/sequelize";

@injectable()
export class BackgroundServiceManager {
  constructor(
    @inject(Cron) private cronJobs: Cron,
  ) {}

  async startServices(): Promise<void> {
    await this.sequelizeInit();
    this.initializeCronJobs();
    // Add more background service initializations here if needed
  }

  private async sequelizeInit(): Promise<void> {
    try {
      console.log("Running database migrations...");

      // Synchronize all models
      await Promise.all([
        Role.sync({ alter: false }),
        User.sync({ alter: false }),
        RefreshToken.sync({ alter: false }),
        DashboardTotal.sync({ alter: false }),
        Announcement.sync({ alter: false }),
        UserLogs.sync({ alter: false }),
      ]);

      console.log("Database migrations completed.");
    } catch (error) {
      console.error("Failed to run migrations:", error);
      process.exit(1);
    }
  }

  private initializeCronJobs(): void {
    this.cronJobs.start('deleteExpiredTokens');
    this.cronJobs.start('insertDashboardTotal');
    this.cronJobs.start('deleteUserLogs');

    console.log('Background cron jobs initialized.');
  }
}
