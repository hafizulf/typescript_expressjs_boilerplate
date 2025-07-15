import { AnnouncementNamespace } from "@/libs/websocket/namespaces/announcement-namespace";
import { APP_API_PREFIX } from "@/config/env";
import { AppError } from "@/exceptions/app-error";
import { BackgroundServiceManager } from "@/modules/common/services/background-service-manager";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import container from "@/container";
import cors from "cors";
import { createServer, Server } from "http";
import { DashboardTotalNamespace } from "@/libs/websocket/namespaces/dashboard-total-namespace";
import { errorHandler } from "@/exceptions/error-handler";
import express, { Request, Response, NextFunction, Application } from "express";
import { inject, injectable } from "inversify";
import { logger } from "@/libs/logger";
import { Mqtt } from "@/libs/mqtt/mqtt-index";
import path from "path";
import { PUBLIC_TIME_NSP } from "@/libs/websocket/namespaces/constants/namespace-constants";
import { PublicTimeNamespace } from "@/libs/websocket/namespaces/public-time-namespace";
import rateLimit from "express-rate-limit";
import { Routes } from "@/presentation/routes";
import { RedisClient } from "@/libs/redis/redis-client";
import { sequelizeMigrate } from "@/modules/common/sequelize";
import { SocketIO } from "@/libs/websocket";
import TYPES from "@/types";
import { OriginService } from "@/modules/origins/origin-service";
import { createCorsOptions } from "@/config/cors-option";
import { OriginType } from "@/modules/origins/origin-dto";

@injectable()
export class Bootstrap {
  public app: Application;
  public httpServer: Server;

  constructor(
    @inject(Routes) private appRoutes: Routes,
    @inject(TYPES.BackgroundServiceManager) private backgroundServiceManager: BackgroundServiceManager,
    @inject(Mqtt) private mqtt: Mqtt,
    @inject(TYPES.OriginService) private originService: OriginService
  ) {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.app.set("trust proxy", 1); // Trust the first proxy

    (async () => {
      try {
        await this.init();
      } catch (err) {
        console.error("Failed to initialize Bootstrap:", err);
        process.exit(1);
      }
    })();
  }

  private async init(): Promise<void> {
    await this.middleware();
    this.setRoutes();
    this.middlewareError();
    this.initializeRedis();
    await this.initializeDatabase();
    this.initializeBackgroundServices();
    await this.initializeSocketIO();
    this.initializeMqtt();
  }

  private initializeRedis(): void {
    RedisClient.getInstance();
    console.log('Redis client initialized');
  }

  private async middleware(): Promise<void> {
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

    // Handle CORS
    const httpCorsOptions = await createCorsOptions(this.originService, OriginType.HTTP);
    this.app.use(cors(httpCorsOptions));
      this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof Error && err.message.includes("Blocked by CORS")) {
          console.error(`[${new Date().toISOString()}] ${err.message} for URL: ${req.url}`);
          res.removeHeader("Access-Control-Allow-Origin");
          res.removeHeader("Access-Control-Allow-Credentials");
          res.removeHeader("Access-Control-Allow-Methods");
          res.removeHeader("Access-Control-Allow-Headers");
          if (req.method === "OPTIONS") {
            return res.status(200).end();
          }
        return res.status(400).json({ error: "CORS policy: invalid origin" });
      }
      return next(err);
    });

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
      const clientIp = request.headers["x-forwarded-for"] || request.socket.remoteAddress || "unknown";
      console.log(`${request.method} url:: ${request.url} from ip:: ${clientIp}`);
      console.log("Raw Headers:", JSON.stringify(request.headers, null, 2));

      next();
    }

    this.app.use(requestLogger);                                       // request logger
  }

  private setRoutes(): void {
    const router = express.Router();

    this.app.use(APP_API_PREFIX, router);
    this.appRoutes.setRoutes(router);   // set routes
    
    router.get("/health-check", (_req: Request, res: Response) => {
      res.status(200).json({
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
      logger.error({
        message: error.message || "Unknown error",
        stack: error.stack,
        details: error,
      });
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

    const invalidPathHandler = (_req: Request, response: Response) => {
      response.status(400).json({ message: "route not found" });
    };

    this.app.use(invalidPathHandler);
    this.app.use(errorLogger);
    this.app.use(errorResponder);
  }

  private async initializeDatabase(): Promise<void> {
    await sequelizeMigrate();
  }

  private initializeBackgroundServices(): void {
    this.backgroundServiceManager.startServices();
  }

  public async initializeSocketIO(): Promise<void> {
    const socketIO = container.get<SocketIO>(TYPES.SocketIO);
    await socketIO.initialize(this.httpServer);

    socketIO.setPublicNamespaces([PUBLIC_TIME_NSP]);

    const socketNamespaces = [
      container.get<DashboardTotalNamespace>(TYPES.DashboardTotalNamespace),
      container.get<AnnouncementNamespace>(TYPES.AnnouncementNamespace),
      new PublicTimeNamespace(),
    ];
    socketIO.initializeNamespaces(socketNamespaces);
    console.log("Socket.IO initialized with namespaces.");
  }

  private initializeMqtt(): void {
    this.mqtt.connect();
    this.mqtt.setSubscriber();
  }
}
