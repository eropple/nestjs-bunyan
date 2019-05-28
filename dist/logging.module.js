"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const lodash_1 = require("lodash");
const options_1 = require("./options");
const injector_keys_1 = require("./injector-keys");
const request_tracker_middleware_1 = require("./request-tracker.middleware");
class LoggingModule {
    static forRoot(options) {
        const realOptions = lodash_1.merge(options_1.DEFAULT_LOGGING_OPTIONS, options);
        const moduleLogger = realOptions.rootLogger.child({ component: LoggingModule.name });
        moduleLogger.info("Building module for injector.");
        const loggingOptions = {
            provide: injector_keys_1.LOGGING_OPTIONS,
            useFactory: () => {
                console.log("LOGGING_OPTIONS provider");
                return realOptions;
            }
        };
        const rootLogger = {
            provide: injector_keys_1.ROOT_LOGGER,
            scope: common_1.Scope.DEFAULT,
            inject: [injector_keys_1.LOGGING_OPTIONS],
            useFactory: (options) => {
                console.log("ROOT_LOGGER provider, typeof(options): ", typeof (options));
                return options.rootLogger;
            }
        };
        const requestLogger = {
            provide: injector_keys_1.LOGGER,
            scope: common_1.Scope.REQUEST,
            inject: [injector_keys_1.ROOT_LOGGER, common_1.forwardRef(() => core_1.REQUEST)],
            useFactory: (rootLogger, request) => {
                console.log("LOGGER provider, typeof(rootLogger, request): ", typeof (rootLogger), typeof (request));
                const correlationId = lodash_1.flatten(request.headers["x-correlation-id"]) || "NO_X_CORRELATION_ID_FOUND";
                const requestLogger = rootLogger.child({ correlationId });
                return requestLogger;
            }
        };
        const testThing = {
            provide: injector_keys_1.TEST_THING,
            scope: common_1.Scope.REQUEST,
            useFactory: () => ({ hello: "world" })
        };
        return {
            module: LoggingModule,
            imports: [],
            providers: [
                rootLogger,
                loggingOptions,
                request_tracker_middleware_1.RequestTrackerMiddleware,
                requestLogger,
                testThing
            ],
            exports: [
                injector_keys_1.ROOT_LOGGER,
                injector_keys_1.LOGGER,
                injector_keys_1.TEST_THING
            ]
        };
    }
    configure(consumer) {
        consumer.apply(request_tracker_middleware_1.RequestTrackerMiddleware).forRoutes({
            method: common_1.RequestMethod.ALL, path: "*"
        });
    }
}
exports.LoggingModule = LoggingModule;
//# sourceMappingURL=logging.module.js.map