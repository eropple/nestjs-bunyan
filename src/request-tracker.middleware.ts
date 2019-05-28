import * as Bunyan from "bunyan";
import { Injectable, NestMiddleware, Scope, Inject } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { Logger, RootLogger, LoggingOptions } from './injector-decorations';
import { REQUEST } from "@nestjs/core";
import { LoggingOptions as Options } from "./options";

@Injectable({ scope: Scope.REQUEST })
export class RequestTrackerMiddleware implements NestMiddleware {
  // private readonly _logger: Bunyan;
  constructor(
    @RootLogger() rootLogger: Bunyan,
    @Logger() logger: Bunyan,
    @LoggingOptions() options: Options,
    @Inject(REQUEST) request: IncomingMessage
  ) {
    console.log("RequestTrackerMiddleware typeof(request): ", typeof(request));
    // this._logger = logger.child({ component: "RequestTracker" });
  }
  use(req: IncomingMessage, res: ServerResponse, next: () => void) {
    const start = new Date();
    const data: { [key: string]: any } = {};

    data.method = req.method;
    data.url = req.url;
    data.ip = req.connection.remoteAddress;

    // this._logger.trace(data, "start request");
    console.log(data);

    next();

    const ms = (new Date()).valueOf() - start.valueOf();
    // this._logger.trace({ ms }, "end request");
    console.log(ms)
  }
}
