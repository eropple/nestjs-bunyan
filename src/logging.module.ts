import { DynamicModule, Scope, RequestMethod, Global, Module } from '@nestjs/common';
import { FactoryProvider, NestModule, MiddlewareConsumer, ValueProvider, INestApplication } from '@nestjs/common/interfaces';
import { REQUEST } from "@nestjs/core";
import * as Bunyan from "bunyan";
import { IncomingMessage } from 'http';
import { merge, flatten } from "lodash";

import { LoggingOptions } from './options';
import { ROOT_LOGGER, LOGGER, LOGGING_OPTIONS, REQUEST_MIDDLEWARE } from './injector-keys';
import { RequestTrackerMiddleware } from './request-tracker.middleware';

@Global()
@Module({})
export class LoggingModule {
  static forRoot(rootLogger: Bunyan, options: LoggingOptions = {}): DynamicModule {
    const loggingOptions: ValueProvider = {
      provide: LOGGING_OPTIONS,
      useValue: options
    };

    const rootLoggerProvider: ValueProvider = {
      provide: ROOT_LOGGER,
      useValue: rootLogger
    };

    const correlationIdHeader = options.correlationIdHeader || "x-correlation-id";
    const requestLoggerProvider: FactoryProvider = {
      provide: LOGGER,
      scope: Scope.REQUEST,
      inject: [ROOT_LOGGER, REQUEST],
      useFactory: (rootLogger: Bunyan, request: IncomingMessage) => {
        const rawId = request.headers[correlationIdHeader];
        const correlationId = flatten<string | undefined>([rawId])[0] || "NO_CORRELATION_ID_FOUND";

        const requestLogger = rootLogger.child({ correlationId });
        return requestLogger;
      }
    }

    const requestMiddlewareProvider: FactoryProvider = {
      provide: REQUEST_MIDDLEWARE,
      // we'd like to use the request-scoped logger here but it seems to
      // not properly populate in the DI container. Because of this, the
      // request tracker handles its own child-logger tagging.
      //
      // For reasons I am currently describing as "impenetrable", the DI
      // container throws a monstrous fit when I try to use `MiddlewareConsumer`
      // to attach `RequestTrackerMiddleware` to all routes. As such, we instead
      // have the helper method below to attach it globally as a functional
      // middleware.
      //
      // TODO: refactor into a single function to shrink the call stack.
      useFactory: () => {
        const mid = new RequestTrackerMiddleware(rootLogger, options);
        return ((req: any, res: any, next: any) => {
          mid.use(req, res, next);
        });
      }
    }

    const mod = {
      module: LoggingModule,
      imports: [],
      providers: [
        rootLoggerProvider,
        loggingOptions,
        requestMiddlewareProvider,
        requestLoggerProvider
      ],
      exports: [
        ROOT_LOGGER,
        LOGGER,
        requestLoggerProvider
      ]
    };

    return mod;
  }

  static addRequestMiddleware(app: INestApplication) {
    app.use(app.get(REQUEST_MIDDLEWARE));
  }
}
