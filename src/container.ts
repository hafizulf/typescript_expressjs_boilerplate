import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "./types";

// Import Bootstrap / kernel
import { IServer, Server } from "@/presentation/server";
// Import Routes
import { Routes } from "@/presentation/routes";
import { UserRoutes } from "@/modules/users/user-routes";
import { RoleRoutes } from "@/modules/roles/role-routes";
// Import Controllers
import { RoleController } from "@/modules/roles/role-controller";
// Import Services
import { RoleService } from "@/modules/roles/role-service";
// Import Interface Repository
import { IRoleRepository } from "@/modules/roles/role-repository-interface";
// Import Repository
import { RoleRepository } from "./modules/roles/role-repository";

//
const container = new Container();

// bootstrap / kernel
container.bind<IServer>(TYPES.Server).to(Server).inSingletonScope();

// Routes
container.bind<Routes>(Routes).toSelf().inSingletonScope();
container.bind<UserRoutes>(UserRoutes).toSelf().inSingletonScope();
container.bind<RoleRoutes>(RoleRoutes).toSelf().inSingletonScope();
// Controllers
container.bind(RoleController).toSelf();
// Services
container.bind(TYPES.RoleService).to(RoleService);
// Repository
container
  .bind<IRoleRepository>(TYPES.IRoleRepository)
  .to(RoleRepository);

export default container;
