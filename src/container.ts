import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "./types";

// Import Bootstrap / kernel
import { IServer, Server } from "@/presentation/server";
// Import Routes
import { Routes } from "@/routes/routes";
import { UserRoutes } from "@/modules/users/user-routes";

const container = new Container();

// bootstrap / kernel
container.bind<IServer>(TYPES.Server).to(Server).inSingletonScope();
// Routes
container.bind<Routes>(Routes).toSelf().inSingletonScope();
container.bind<UserRoutes>(UserRoutes).toSelf().inSingletonScope();

export default container;
