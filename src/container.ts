import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "./types";

// Import Bootstrap / kernel / libs
import { IServer, Server } from "@/presentation/server";
import { Cron } from "@/libs/cron-job/cron";
import { SocketIO } from "@/libs/websocket";
// Import Routes
import { Routes } from "@/presentation/routes";
import { WebAuthRoutes } from "@/modules/authentications/web-auth-routes";
import { UserRoutes } from "@/modules/users/user-routes";
import { RoleRoutes } from "@/modules/roles/role-routes";
// Import Middlewares
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
// Import Controllers
import { WebAuthController } from "@/modules/authentications/web-auth-controller";
import { RoleController } from "@/modules/roles/role-controller";
import { UserController } from "@/modules/users/user-controller";
// Import Services
import { WebAuthService } from "@/modules/authentications/web-auth-service";
import { RoleService } from "@/modules/roles/role-service";
import { UserService } from "@/modules/users/user-service";
import { RefreshTokenService } from "@/modules/refresh-tokens/refresh-token-service";
import { DashboardTotalService } from "@/modules/dashboard-totals/dashboard-total-service";
// Import Interface Repository
import { IRoleRepository } from "@/modules/roles/role-repository-interface";
import { IUserRepository } from "@/modules/users/user-repository-interface";
import { IRefreshTokenRepositoryInterface } from "@/modules/refresh-tokens/refresh-token-repository-interface";
import { IDashboardTotalRepository } from "./modules/dashboard-totals/dashboard-total-repository-interface";
// Import Repository
import { RoleRepository } from "@/modules/roles/role-repository";
import { UserRepository } from "@/modules/users/user-repository";
import { RefreshTokenRepository } from "@/modules/refresh-tokens/refresh-token-repository";
import { DashboardTotalRepository } from "@/modules/dashboard-totals/dashboard-total-repository";
// Import Socket Namespace
import { DashboardTotalNamespace } from "@/libs/websocket/dashboard-total-namespace";

//
const container = new Container();

// bootstrap / kernel / libs
container.bind<IServer>(TYPES.Server).to(Server).inSingletonScope();
container.bind<Cron>(Cron).toSelf().inSingletonScope();
container.bind<SocketIO>(TYPES.SocketIO).to(SocketIO).inSingletonScope();

// Routes
container.bind<Routes>(Routes).toSelf().inSingletonScope();
container.bind<WebAuthRoutes>(WebAuthRoutes).toSelf().inSingletonScope();
container.bind<UserRoutes>(UserRoutes).toSelf().inSingletonScope();
container.bind<RoleRoutes>(RoleRoutes).toSelf().inSingletonScope();
// Middleware
container.bind(AuthMiddleware).toSelf();
// Controllers
container.bind(WebAuthController).toSelf();
container.bind(RoleController).toSelf();
container.bind(UserController).toSelf();
// Services
container.bind(TYPES.WebAuthService).to(WebAuthService);
container.bind(TYPES.RoleService).to(RoleService);
container.bind(TYPES.UserService).to(UserService);
container.bind(TYPES.RefreshTokenService).to(RefreshTokenService);
container.bind(TYPES.DashboardTotalService).to(DashboardTotalService);
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

// Socket Namespace
container
  .bind<DashboardTotalNamespace>(TYPES.DashboardTotalNamespace)
  .to(DashboardTotalNamespace);

export default container;
