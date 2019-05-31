import { LogLevel } from "bunyan";

export interface LoggingOptions {
  correlationIdHeader?: string;

  requestTrackerComponent?: string;
  requestTrackerLevel?: LogLevel;
}
