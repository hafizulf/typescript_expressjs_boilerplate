import { AnnouncementNamespace } from "@/libs/websocket/announcement-namespace";
import { APP_API_PREFIX } from "@/config/env";
import { AppError } from "@/exceptions/app-error";
import * as bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import container from "@/container";
import cors from "cors";
import { createServer, Server } from "http";
import { DashboardTotalNamespace } from "@/libs/websocket/dashboard-total-namespace";
import { errorHandler } from "@/exceptions/error-handler";
import express, { Request, Response, NextFunction, Application } from "express";
import { logger } from "@/libs/logger";
import path from "path";
import rateLimit from "express-rate-limit";
import { Routes } from "@/presentation/routes";
import { RedisClient } from "@/libs/redis/redis-client";
import { SocketIO } from "@/libs/websocket";
import TYPES from "@/types";

export class Bootstrap {
  public app: Application;
  public httpServer: Server;

  constructor(
    private appRoutes: Routes,
  ) {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.initializeRedis();     // initialize redis
    this.middleware();          // apply middleware
    this.setRoutes();           // set routes
    this.middlewareError();     // error handler
    this.initializeSocketIO();  // initialize socket
  }

  private initializeRedis(): void {
    RedisClient.getInstance();
    console.log('Redis client initialized');
  }

  private middleware(): void {
    const apiRateLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,     // 15 minutes
      max: 100,                     // limit each IP to 100 requests per windowMs
      message: {
        status: 429,
        message: "Too many requests, please try again later.",
      },
      standardHeaders: true,        // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false,         // Disable the `X-RateLimit-*` headers
    })

    this.app.use(APP_API_PREFIX, apiRateLimiter);                       // apply rate limiter

    this.app.use(cors({
        origin: '*',                                                    // *change to your frontend url
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }));
    this.app.use(bodyParser.json());                                    // parse application/json
    this.app.use(bodyParser.urlencoded({ extended: false }));           // parse application/x-www-form-urlencoded
    this.app.use(cookieParser());                                       // parse cookies
    this.app.use(express.static(path.join(__dirname, "../../public"))); // serve static files

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

      const clientIp = request.headers["x-forwarded-for"] || request.socket.remoteAddress || 'unknown';
      console.log(`${request.method} url:: ${request.url} from ip:: ${clientIp}`);

      next();
    }

    this.app.use(requestLogger);                                       // request logger
  }

  private setRoutes(): void {
    const router = express.Router();

    this.app.use(APP_API_PREFIX, router);
    this.appRoutes.setRoutes(router);                                   // set all routes

    router.get("/health-check", (_req: Request, res: Response): Response => {
      return res.status(200).json({
        status: "ok",
        message: "Server is up and running",
      });
    });

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

  public initializeSocketIO(): void {
    SocketIO.initialize(this.httpServer);

    const socketNamespaces = [
      container.get<DashboardTotalNamespace>(TYPES.DashboardTotalNamespace),
      container.get<AnnouncementNamespace>(TYPES.AnnouncementNamespace),
    ];

    SocketIO.initializeNamespaces(socketNamespaces);
    console.log("Socket.IO initialized with namespaces.");
  }
}
