import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "./types";

// Import Bootstrap / kernel / libs
import { IServer, Server } from "@/presentation/server";
import { Bootstrap } from "@/presentation/bootstrap";
import { Cron } from "@/libs/cron-job/cron";
import { SocketIO } from "@/libs/websocket";
// Import Routes
import { Routes } from "@/presentation/routes";
import { WebAuthRoutes } from "@/modules/authentications/web-auth-routes";
import { UserRoutes } from "@/modules/users/user-routes";
import { RoleRoutes } from "@/modules/roles/role-routes";
import { AnnouncementRoutes } from "@/modules/announcements/announcement-routes";
// Import Middlewares
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
// Import Controllers
import { WebAuthController } from "@/modules/authentications/web-auth-controller";
import { RoleController } from "@/modules/roles/role-controller";
import { UserController } from "@/modules/users/user-controller";
import { AnnouncementController } from "@/modules/announcements/announcement-controller";
// Import Services
import { BackgroundServiceManager } from "./modules/common/services/background-service-manager";
import { WebAuthService } from "@/modules/authentications/web-auth-service";
import { RoleService } from "@/modules/roles/role-service";
import { UserService } from "@/modules/users/user-service";
import { RefreshTokenService } from "@/modules/refresh-tokens/refresh-token-service";
import { DashboardTotalService } from "@/modules/dashboard-totals/dashboard-total-service";
import { AnnouncementService } from "@/modules/announcements/announcement-service";
import { ManageDbTransactionService } from "@/modules/common/services/manage-db-transaction-service";
import { UserLogsService } from "@/modules/user-logs/user-logs-service";
import { MqttService } from "@/modules/common/services/mqtt-service";

// Import Interface Repository
import { IRoleRepository } from "@/modules/roles/role-repository-interface";
import { IUserRepository } from "@/modules/users/user-repository-interface";
import { IRefreshTokenRepositoryInterface } from "@/modules/refresh-tokens/refresh-token-repository-interface";
import { IDashboardTotalRepository } from "@/modules/dashboard-totals/dashboard-total-repository-interface";
import { IAnnouncementRepository } from "@/modules/announcements/announcement-repository-interface";
import { IUserLogsRepository } from "@/modules/user-logs/user-logs-repository-interface";
// Import Repository
import { RoleRepository } from "@/modules/roles/role-repository";
import { UserRepository } from "@/modules/users/user-repository";
import { RefreshTokenRepository } from "@/modules/refresh-tokens/refresh-token-repository";
import { DashboardTotalRepository } from "@/modules/dashboard-totals/dashboard-total-repository";
import { AnnouncementRepository } from "@/modules/announcements/announcement-repository";
import { UserLogsRepository } from "@/modules/user-logs/user-logs-repository";
// Import Socket Namespace
import { NamespaceConfigService } from "@/libs/websocket/namespaces/namespace-config-service";
import { DashboardTotalNamespace } from "@/libs/websocket/namespaces/dashboard-total-namespace";
import { AnnouncementNamespace } from "@/libs/websocket/namespaces/announcement-namespace";
// Import Socket Middleware
import { SocketAuthenticationMiddleware } from "@/libs/websocket/middlewares/socket-authentication-middleware";
import { SocketAuthorizationMiddleware } from "@/libs/websocket/middlewares/socket-authorization-middleware";
import { SocketEventWhitelistMiddleware } from "@/libs/websocket/middlewares/socket-event-whitelist-middleware";
// Import Mqtt
import { Mqtt } from "@/libs/mqtt/mqtt-index";
import { MachineTsBoiler1Subscriber } from "./libs/mqtt/subscribers/machine-ts-boiler1-subscriber";

//
const container = new Container();

// bootstrap / kernel / libs
container.bind<IServer>(TYPES.Server).to(Server).inSingletonScope();
container.bind<Bootstrap>(TYPES.Bootstrap).to(Bootstrap).inSingletonScope();
container.bind<Cron>(Cron).toSelf().inSingletonScope();
container.bind<SocketIO>(TYPES.SocketIO).to(SocketIO).inSingletonScope();
container.bind<Mqtt>(Mqtt).toSelf().inSingletonScope();

// Routes
container.bind<Routes>(Routes).toSelf().inSingletonScope();
container.bind<WebAuthRoutes>(WebAuthRoutes).toSelf().inSingletonScope();
container.bind<UserRoutes>(UserRoutes).toSelf().inSingletonScope();
container.bind<RoleRoutes>(RoleRoutes).toSelf().inSingletonScope();
container.bind<AnnouncementRoutes>(AnnouncementRoutes).toSelf().inSingletonScope();
// Middleware
container.bind(AuthMiddleware).toSelf();
// Controllers
container.bind(WebAuthController).toSelf();
container.bind(RoleController).toSelf();
container.bind(UserController).toSelf();
container.bind(AnnouncementController).toSelf();
// Services
container.bind<BackgroundServiceManager>(TYPES.BackgroundServiceManager).to(BackgroundServiceManager);
container.bind(TYPES.WebAuthService).to(WebAuthService);
container.bind(TYPES.RoleService).to(RoleService);
container.bind(TYPES.UserService).to(UserService);
container.bind(TYPES.RefreshTokenService).to(RefreshTokenService);
container.bind(TYPES.DashboardTotalService).to(DashboardTotalService);
container.bind(TYPES.AnnouncementService).to(AnnouncementService);
container.bind(TYPES.ManageDbTransactionService).to(ManageDbTransactionService);
container.bind(TYPES.UserLogsService).to(UserLogsService);
container.bind(TYPES.MqttService).to(MqttService).inSingletonScope();
// Repository
container
  .bind<IRoleRepository>(TYPES.IRoleRepository)
  .to(RoleRepository);
container
  .bind<IUserRepository>(TYPES.IUserRepository)
  .to(UserRepository);
container
  .bind<IRefreshTokenRepositoryInterface>(TYPES.IRefreshTokenRepository)
  .to(RefreshTokenRepository);
container
  .bind<IDashboardTotalRepository>(TYPES.IDashboardTotalRepository)
  .to(DashboardTotalRepository);
container
  .bind<IAnnouncementRepository>(TYPES.IAnnouncementRepository)
  .to(AnnouncementRepository);
container
  .bind<IUserLogsRepository>(TYPES.IUserLogsRepository)
  .to(UserLogsRepository);

// Socket Namespace
container
  .bind<NamespaceConfigService>(TYPES.NamespaceConfigService)
  .to(NamespaceConfigService)
  .inSingletonScope();
container
  .bind<DashboardTotalNamespace>(TYPES.DashboardTotalNamespace)
  .to(DashboardTotalNamespace);
container
  .bind<AnnouncementNamespace>(TYPES.AnnouncementNamespace)
  .to(AnnouncementNamespace);
// Socket Middleware
container
  .bind<SocketAuthenticationMiddleware>(TYPES.SocketAuthenticationMiddleware)
  .to(SocketAuthenticationMiddleware);
container
  .bind<SocketAuthorizationMiddleware>(TYPES.SocketAuthorizationMiddleware)
  .to(SocketAuthorizationMiddleware);
container
  .bind<SocketEventWhitelistMiddleware>(TYPES.SocketEventWhitelistMiddleware)
  .to(SocketEventWhitelistMiddleware);
// MQTT
container
  .bind<MachineTsBoiler1Subscriber>(MachineTsBoiler1Subscriber)
  .toSelf().inSingletonScope();

export default container;
