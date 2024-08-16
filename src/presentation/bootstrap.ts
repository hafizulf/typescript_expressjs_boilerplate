import { createServer, Server } from "http";
import * as bodyParser from "body-parser";
import express, { Request, Response, NextFunction, Application } from "express";
import path from "path";
import { AppError } from "@/exceptions/app-error";
import { logger } from "@/libs/logger";
import { APP_API_PREFIX } from "@/config/env";
import { Routes } from "@/routes/routes";
// import fs from "fs";

export class Bootstrap {
  public app: Application;
  public httpServer: Server;

  constructor(
    private appRoutes: Routes,
  ) {
    this.app = express();
    this.middleware();
    this.setRoutes();
    this.middlewareError();
    this.httpServer = createServer(this.app);
  }

  private middleware(): void {
    const requestLogger = (
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      response.removeHeader("X-Powered-By");
      response.header("Access-Control-Allow-Origin", "*");
      response.header(
        "Access-Control-Allow-Headers",
        "content-type, Authorization"
      );
      response.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );

      console.log(`${request.method} url:: ${request.url}`);

      next();
    }

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static(path.join(__dirname, "../../public")));
    this.app.use(requestLogger);
  }

  private setRoutes(): void {
    const router = express.Router();

    this.app.use(APP_API_PREFIX, router);
    router.get("/health-check", (_req: Request, res: Response): Response => {
      return res.status(200).json({
        status: "ok",
        message: "Server is up and running",
      });
    });
    this.appRoutes.setRoutes(router); // set routes
    this.app.use("/storage", express.static(path.join(process.cwd(), "./storage")));
  }

  private middlewareError(): void {
    const errorLogger = (
      error: AppError,
      _req: Request,
      _res: Response,
      next: NextFunction
    ) => {
      logger.error(error.error);
      next(error);
    };

    this.app.use(errorLogger);
  }
}
