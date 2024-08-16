import { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const transportInfo: DailyRotateFile = new DailyRotateFile({
    filename: "logs/%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "info",
});

const transportError: DailyRotateFile = new DailyRotateFile({
    filename: "logs/%DATE%.error.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "error",
});

export const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`
        })
      )
    }),
    transportError,
    transportInfo,
  ]
})
