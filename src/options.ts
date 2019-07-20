import { LogLevel, LogLevelString } from "bunyan";

export interface LoggingOptions {
  /**
   * If true, the "request-scoped logger" will actually be the root logger of
   * the application. This is helpful when you use something like
   * `nestjs-command`, which allows you to easily write CLI scripts but does not
   * include the concept of a "request scope". Assuming that loggers are the
   * only request-scoped services you're creating (often a safe assumption),
   * this means your services will fall back to default scope and be available.
   */
  staticLogger?: boolean;

  /**
   * The correlation ID to use when making a child for all requests.
   */
  correlationIdHeader?: string;

  /**
   * The Bunyan `component` value to use for request logs.
   */
  requestTrackerComponent?: string;
  /**
   * The level at which requests should be logged.
   */
  requestTrackerLevel?: LogLevel | LogLevelString;
}
