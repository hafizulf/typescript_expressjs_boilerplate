import http from "http";
import { createHttpTerminator } from "http-terminator";
import { Application } from "express";
import container from '@/container';
import { IServer } from "@/presentation/server";
import TYPES from "./types";

const start = (): Application => {
  const server = container.get<IServer>(TYPES.Server);
  return server.start();
}

export const server = http.createServer(start());
export const httpTerminator = createHttpTerminator({ server });
