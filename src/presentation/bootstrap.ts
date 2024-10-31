import { createServer, Server } from "http";
import * as bodyParser from "body-parser";
import express, { Request, Response, NextFunction, Application } from "express";
import path from "path";
import { AppError } from "@/exceptions/app-error";
import { logger } from "@/libs/logger";
import { APP_API_PREFIX } from "@/config/env";
import { Routes } from "@/presentation/routes";
import { errorHandler } from "@/exceptions/error-handler";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { RedisClient } from "@/libs/redis/redis-client";

export class Bootstrap {
  public app: Application;
  public httpServer: Server;

  constructor(
    private appRoutes: Routes,
  ) {
    this.app = express();
    this.initializeRedis(); // initialize redis
    this.middleware();
    this.setRoutes();
    this.middlewareError();
    this.httpServer = createServer(this.app);
  }

  private initializeRedis(): void {
    RedisClient.getInstance();
    console.log('Redis client initialized');
  }

  private middleware(): void {
    this.app.use(cors({
        origin: 'http://127.0.0.1:8080', // Ensure this matches your frontend URL
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }));

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
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, "../../public")));
    this.app.use(requestLogger);
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

    const errorResponder = (
      error: AppError,
      _req: Request,
      res: Response,
      _next: NextFunction
    ) => {
      errorHandler.handleError(error, res);
    };

    const invalidPathHandler = (
      _req: Request,
      response: Response,
    ) => {
      response.status(400);
      response.json({
        message: "invalid path",
      });
    };

    this.app.use(errorLogger);
    this.app.use(errorResponder);
    this.app.use(invalidPathHandler);
  }

  private setRoutes(): void {
    const router = express.Router();

    this.app.use(APP_API_PREFIX, router);
    this.appRoutes.setRoutes(router); // set routes
    router.get("/health-check", (_req: Request, res: Response): Response => {
      return res.status(200).json({
        status: "ok",
        message: "Server is up and running",
      });
    });
    this.app.use("/storage", express.static(path.join(process.cwd(), "./storage")));
  }
}
