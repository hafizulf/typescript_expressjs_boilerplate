import { inject, injectable } from "inversify";
import { CronJob } from "cron";
import TYPES from "@/types";
import { RefreshTokenService } from "@/modules/refresh-tokens/refresh-token-service";
import { DashboardTotalService } from "@/modules/dashboard-totals/dashboard-total-service";
import { UserLogsService } from "@/modules/user-logs/user-logs-service";

interface CronJobOptions {
  onComplete?: () => void;
  runOnInit?: boolean;
  timeZone?: string;
}

@injectable()
export class Cron {
  private _jobs: Record<string, CronJob> = {};

  constructor(
    @inject(TYPES.RefreshTokenService)
    private _refreshTokenService: RefreshTokenService,
    @inject(TYPES.DashboardTotalService)
    private _dashboardTotalService: DashboardTotalService,
    @inject(TYPES.UserLogsService)
    private _userLogsService: UserLogsService,
  ) {
    this._addJob(
      'deleteExpiredTokens',
      '0 0 * * *', // every day at midnight
      async () => {
        console.log("Running deleteExpiredTokens job at:", new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
        await this._refreshTokenService.deleteExpiredTokens();
      }
    )

    this._addJob(
      'insertDashboardTotal',
      '0 * * * *',
      async () => {
        console.log("Running insertDashboardTotal job at:", new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
        await this._dashboardTotalService.insertDashboardTotal();
      }
    )

    this._addJob(
      'deleteUserLogs',
      '0 0 * * *',
      async () => {
        console.log("Running deleteUserLogs job at:", new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
        await this._userLogsService.deleteOldUserLogs();
      }
    )

    // add another cron job
    this._addJob(
      'anotherJob',
      '* * * * *',
      () => console.log('Running another job at:', new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))
    )
  }

  private _addJob(
    jobKey: string,
    cronExpression: string,
    callback: () => void,
    options: CronJobOptions = {}
  ) {
    this._jobs[jobKey] = new CronJob(
      cronExpression,
      callback,
      options.onComplete || null,
      options.runOnInit ?? false,
      options.timeZone ?? "Asia/Jakarta"
    )
  }

  public start(jobKey?: string) {
    if(jobKey) {
      if(this._jobs[jobKey] && !this._jobs[jobKey].running) {
        this._jobs[jobKey].start();
      }
    } else {
      Object.keys(this._jobs).forEach((key) => {
        if (!this._jobs[key]?.running) {
          this._jobs[key]?.start();
        }
      })
    }
  }

  public stop(jobKey?: string) {
    if(jobKey) {
      if(this._jobs[jobKey] && this._jobs[jobKey].running) {
        this._jobs[jobKey].stop();
      }
    } else {
      Object.keys(this._jobs).forEach((key) => {
        if (this._jobs[key]?.running) {
          this._jobs[key]?.stop();
        }
      })
    }
  }
}
