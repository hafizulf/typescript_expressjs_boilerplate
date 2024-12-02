import { Application } from "express";
import { injectable } from "inversify";
import { Bootstrap } from "@/presentation/bootstrap";
import {  APP_PORT } from "@/config/env";
import container from "@/container";
import TYPES from "@/types";
export interface IServer {
  start(): Application;
}

@injectable()
export class Server implements IServer {
  start(): Application {
    const bootstrap = container.get<Bootstrap>(TYPES.Bootstrap);

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
