import { Application } from "express";
import { injectable } from "inversify";
import { Bootstrap } from "@/presentation/bootstrap";
import { APP_HOST, APP_PORT } from "@/config/env";
import container from "@/container";
import { Routes } from "@/routes/routes";

export interface IServer {
  start(): Application;
}

@injectable()
export class Server implements IServer {
  start(): Application {
    const bootstrap = new Bootstrap(
      container.resolve<Routes>(Routes),
    )

    bootstrap.httpServer.listen(
      <number>(<unknown>APP_PORT),
      APP_HOST,
      undefined,
      () => {
        console.log(`Server started at http://${APP_HOST}:${APP_PORT}`);
      }
    );

    return bootstrap.app;
  }
}
