import { DynamicModule, Scope, RequestMethod, forwardRef } from '@nestjs/common';
import { FactoryProvider, NestModule, MiddlewareConsumer, ValueProvider } from '@nestjs/common/interfaces';
import { REQUEST } from "@nestjs/core";
import * as Bunyan from "bunyan";
import { IncomingMessage } from 'http';
import { merge, flatten } from "lodash";

import { LoggingOptions, DEFAULT_LOGGING_OPTIONS } from './options';
import { ROOT_LOGGER, LOGGER, LOGGING_OPTIONS, TEST_THING } from './injector-keys';
import { RequestTrackerMiddleware } from './request-tracker.middleware';

export class LoggingModule implements NestModule {
  static forRoot(options: Partial<LoggingOptions>): DynamicModule {
    const realOptions = merge(DEFAULT_LOGGING_OPTIONS, options);
    const moduleLogger = realOptions.rootLogger.child({ component: LoggingModule.name });
    moduleLogger.info("Building module for injector.");

    const loggingOptions: FactoryProvider = {
      provide: LOGGING_OPTIONS,
      useFactory: () => {
        console.log("LOGGING_OPTIONS provider")
        return realOptions;
      }
    };

    const rootLogger: FactoryProvider = {
      provide: ROOT_LOGGER,
      scope: Scope.DEFAULT,
      inject: [LOGGING_OPTIONS],
      useFactory: (options: LoggingOptions) => {
        console.log("ROOT_LOGGER provider, typeof(options): ", typeof(options))
        return options.rootLogger;
      }
    };

    const requestLogger: FactoryProvider = {
      provide: LOGGER,
      scope: Scope.REQUEST,
      inject: [ROOT_LOGGER, forwardRef(() => REQUEST)],
      useFactory: (rootLogger: Bunyan, request: IncomingMessage) => {
        console.log("LOGGER provider, typeof(rootLogger, request): ", typeof(rootLogger), typeof(request));
        const correlationId = flatten(request.headers["x-correlation-id"])[0] || "NO_X_CORRELATION_ID_FOUND";

        const requestLogger = rootLogger.child({ correlationId });
        return requestLogger;
      }
    }

    const testThing: FactoryProvider = {
      provide: TEST_THING,
      scope: Scope.REQUEST,
      useFactory: () => ({ hello: "world" })
    }

    return {
      module: LoggingModule,
      imports: [],
      providers: [
        rootLogger,
        loggingOptions,
        RequestTrackerMiddleware,
        requestLogger,
        testThing
      ],
      exports: [
        ROOT_LOGGER,
        LOGGER,
        TEST_THING
      ]
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestTrackerMiddleware).forRoutes({
      method: RequestMethod.ALL, path: "*"
    });
  }
}
