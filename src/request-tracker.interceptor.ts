import * as Bunyan from "bunyan";
import * as Crypto from "crypto";
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { LoggingOptions } from "./options";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class RequestTrackerInterceptor implements NestInterceptor {
  private readonly _logger: Bunyan;
  private readonly _dropHeaders: Array<string>;

  constructor(
    rootLogger: Bunyan,
    private readonly options: LoggingOptions
  ) {
    this._logger = rootLogger.child({ component: options.requestTrackerComponent || "RequestTracker" });
    if (options.requestTrackerLevel) {
      this._logger.level(options.requestTrackerLevel);
    }

    this._dropHeaders = [ 'authorization', ...this.options.dropHeaders || [] ].map(h => h.toLowerCase());
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const start = new Date();
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<IncomingMessage>();
    const res = ctx.getResponse<ServerResponse>();

    const data: { [key: string]: any } = {};

    data.method = req.method;
    data.url = req.url;

    if (this.options.ipSalt) {
      data.ipHash =
        Crypto
          .createHash('shake128')
          .update(`${this.options.ipSalt || ''}${req.connection.remoteAddress}`)
          .digest('base64')
          .replace(/=/g, '');
    } else {
      data.ip = req.connection.remoteAddress;
    }

    data.headers = { ...req.headers };

    for (const h of this._dropHeaders) {
      delete data.headers[h];
    }

    this._logger.info({ request: "start", ...data });

    return next
      .handle()
      .pipe(
        tap(() => {
          const ms = (new Date()).valueOf() - start.valueOf();
          this._logger.info({ request: "end", code: res.statusCode, ms });
        }),
      );
  }
}
