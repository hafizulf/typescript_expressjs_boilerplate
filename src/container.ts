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
import { UserController } from "@/modules/users/user-controller";
// Import Services
import { RoleService } from "@/modules/roles/role-service";
// Import Interface Repository
import { IRoleRepository } from "@/modules/roles/role-repository-interface";
// Import Repository
import { RoleRepository } from "@/modules/roles/role-repository";
import { UserService } from "@/modules/users/user-service";
import { IUserRepository } from "./modules/users/user-repository-interface";
import { UserRepository } from "./modules/users/user-repository";

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
container.bind(UserController).toSelf();
// Services
container.bind(TYPES.RoleService).to(RoleService);
container.bind(TYPES.UserService).to(UserService);
// Repository
container
  .bind<IRoleRepository>(TYPES.IRoleRepository)
  .to(RoleRepository);
container
  .bind<IUserRepository>(TYPES.IUserRepository)
  .to(UserRepository);

export default container;
