import { Application } from "express";
import { injectable } from "inversify";
import { Bootstrap } from "@/presentation/bootstrap";
import {  APP_PORT } from "@/config/env";
import container from "@/container";
import { Routes } from "@/presentation/routes";
import { Cron } from "@/libs/cron-job/cron";
// import { SocketIO } from "@/libs/websocket";

export interface IServer {
  start(): Application;
}

@injectable()
export class Server implements IServer {
  start(): Application {
    const bootstrap = new Bootstrap(
      container.resolve<Routes>(Routes),
    )
    // cron job
    const cronJobs = container.get(Cron);
    cronJobs.start('deleteExpiredTokens');

    bootstrap.httpServer.listen(
      <number>(<unknown>APP_PORT),
      undefined,
      () => {
        console.log(`Server started at *:${APP_PORT}`);
      }
    );
    return bootstrap.app;
  }
}
