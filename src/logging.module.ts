import { DynamicModule, Scope, Global, Module } from '@nestjs/common';
import { FactoryProvider, ValueProvider } from '@nestjs/common/interfaces';
import { REQUEST, APP_INTERCEPTOR } from "@nestjs/core";
import * as Bunyan from "bunyan";
import { Request as ExpressRequest } from 'express';
import { flatten } from "lodash";

import { LoggingOptions } from './options';
import { ROOT_LOGGER, LOGGER, LOGGING_OPTIONS } from './injector-keys';
import { RequestTrackerInterceptor } from './request-tracker.interceptor';
import { Logger } from './injector-decorations';

@Global()
@Module({})
export class LoggingModule {
  static forRoot(rootLogger: Bunyan, options: LoggingOptions = {}): DynamicModule {
    const moduleLogger = rootLogger.child({ component: 'LoggingModule' });

    const loggingOptions: ValueProvider = {
      provide: LOGGING_OPTIONS,
      useValue: options
    };

    const rootLoggerProvider: ValueProvider = {
      provide: ROOT_LOGGER,
      useValue: rootLogger
    };

    const correlationIdHeader = options.correlationIdHeader || "x-correlation-id";
    const requestLoggerProvider: FactoryProvider =
      options.staticLogger
        ? {
          provide: LOGGER,
          scope: Scope.DEFAULT,
          inject: [ROOT_LOGGER],
          useFactory: (rootLogger: Bunyan) => rootLogger,
        }
        : {
          provide: LOGGER,
          scope: Scope.REQUEST,
          inject: [ROOT_LOGGER, REQUEST],
          useFactory: (rootLogger: Bunyan, request: ExpressRequest) => {
            const rawId = request ? request.headers[correlationIdHeader] : [];
            const correlationId = flatten<string | undefined>([rawId])[0] || "NO_CORRELATION_ID_FOUND";

            const requestLogger = rootLogger.child({ correlationId });
            if (options.postRequestCreate) {
              const newFields = options.postRequestCreate(requestLogger, request);
              requestLogger.fields = { ...requestLogger.fields, ...newFields };
            }
            return requestLogger;
          }
        }

    const mod = {
      module: LoggingModule,
      imports: [],
      providers: [
        rootLoggerProvider,
        loggingOptions,
        requestLoggerProvider
      ],
      exports: [
        ROOT_LOGGER,
        LOGGER,
        requestLoggerProvider
      ]
    };

    if (!options.skipRequestInterceptor) {
      moduleLogger.info('Adding request interceptor.');
      const requestInterceptorProvider: FactoryProvider = {
        provide: APP_INTERCEPTOR,
        scope: Scope.REQUEST,
        inject: [LOGGING_OPTIONS, LOGGER],
        useFactory: (opts: LoggingOptions, logger: Bunyan) => new RequestTrackerInterceptor(logger, opts),
      }

      mod.providers.push(requestInterceptorProvider);
    }

    return mod;
  }
}
