import * as Bunyan from "bunyan";
import { Injectable, NestMiddleware, flatten, Inject, Options } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { RootLogger } from './injector-decorations';
import onHeaders from "on-headers";
import { LOGGING_OPTIONS } from "./injector-keys";
import { LoggingOptions } from "./options";

export class RequestTrackerMiddleware implements NestMiddleware {
  private readonly _logger: Bunyan;

  constructor(
    rootLogger: Bunyan,
    private readonly options: LoggingOptions
  ) {
    this._logger = rootLogger.child({ component: options.requestTrackerComponent || "RequestTracker" });
    if (options.requestTrackerLevel) {
      this._logger.level(options.requestTrackerLevel);
    }
  }

  use(req: IncomingMessage, res: ServerResponse, next: () => void) {
    const start = new Date();
    const data: { [key: string]: any } = {};

    const correlationId = flatten([req.headers[this.options.correlationIdHeader || "x-correlation-id"]])[0] || "NO_CORRELATION_ID_FOUND";
    data.method = req.method;
    data.url = req.url;
    data.ip = req.connection.remoteAddress;
    data.headers = req.headers;

    this._logger.info({ correlationId, request: "start", ...data });

    onHeaders(res, () => {
      const ms = (new Date()).valueOf() - start.valueOf();
      this._logger.info({ correlationId, request: "end", code: res.statusCode, ms });
    })

    next();
  }
}
