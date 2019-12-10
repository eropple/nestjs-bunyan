import { LogLevel, LogLevelString } from "bunyan";
import { Bunyan } from './extra-types';
import { Request as ExpressRequest } from 'express';

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
   * If true, will not attach the `RequestTrackerInterceptor` to your request
   * chain.
   */
  skipRequestInterceptor?: boolean;

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

  /**
   * A set of headers to drop from the log. `Authorization` will _always_ be
   * dropped; this is not removable.
   */
  dropHeaders?: Array<string>;

  /**
   * Pass a string to pseudonymize all IP addresses being logged by the request
   * middleware.
   */
  ipSalt?: string;

  /**
   * A function that will be executed after the creation of a request-scoped
   * logger. This can be useful if, for example, you need to attach fields to
   * a request that will persist for the entire request. Return an object
   * and it will be appended into the logger's fields.
   */
  postRequestCreate?: (logger: Bunyan, request: ExpressRequest) => { [key: string]: any };
}
