import { inject, injectable } from "inversify";
import { CronJob } from "cron";
import TYPES from "@/types";
import { RefreshTokenService } from "@/modules/refresh-tokens/refresh-token-service";

@injectable()
export class Cron {
  private _job: CronJob;

  constructor(
    @inject(TYPES.RefreshTokenService) private _refreshTokenService: RefreshTokenService,
  ) {
    this._job = new CronJob(
      "*/2 * * * *", // every 2 minutes
      async () => {
        console.log("Cron job ticked at:", new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));

        // services
        await this._refreshTokenService.deleteExpiredTokens();
      },
      null,
      true,
      "Asia/Jakarta"
    )
  }

  public start() {
    if(!this._job.running) {
      this._job.start();
      console.log("Cron job started at:", new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    }
  }

  public stop() {
    if(this._job.running) {
      this._job.stop();
      console.log("Cron job stopped at:", new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    }
  }
}
