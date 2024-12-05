import { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const onlyInfoLogs = format((info) => {
  if (info.level === "error") {
    return false;
  }
  return info;
});

const customTimestamp = format((info) => {
  const localTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
  info.timestamp = localTime;
  return info;
});

const transportInfo: DailyRotateFile = new DailyRotateFile({
    filename: "logs/%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "info",
    format: format.combine(
      onlyInfoLogs(), // Apply the filter to exclude errors.
      customTimestamp(),
      format.json()
    ),
});

const transportError: DailyRotateFile = new DailyRotateFile({
    filename: "logs/%DATE%.error.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "error",
    format: format.combine(
      customTimestamp(),
      format.errors({ stack: true }),
      format.json()
    ),
});

export const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        customTimestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`
        })
      )
    }),
    transportError,
    transportInfo,
  ]
})
