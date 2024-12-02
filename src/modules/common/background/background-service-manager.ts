import { inject, injectable } from "inversify";
import { Cron } from "@/libs/cron-job/cron";

@injectable()
export class BackgroundServiceManager {
  constructor(
    @inject(Cron) private cronJobs: Cron,
  ) {}

  startServices(): void {
    this.initializeCronJobs();
    // Add more background service initializations here if needed
  }

  private initializeCronJobs(): void {
    this.cronJobs.start('deleteExpiredTokens');
    this.cronJobs.start('insertDashboardTotal');

    console.log('Background cron jobs initialized.');
  }
}
