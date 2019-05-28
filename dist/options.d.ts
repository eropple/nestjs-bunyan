import * as Bunyan from "bunyan";
export interface LoggingOptions {
    rootLogger: Bunyan;
    requestScope: Symbol;
}
export declare const DEFAULT_LOGGING_OPTIONS: LoggingOptions;
