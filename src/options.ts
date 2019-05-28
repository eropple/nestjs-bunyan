import { REQUEST } from "@nestjs/core";
import * as Bunyan from "bunyan";

export interface LoggingOptions {
  rootLogger: Bunyan;
  requestScope: Symbol;
}

export const DEFAULT_LOGGING_OPTIONS: LoggingOptions = {
  rootLogger: Bunyan.createLogger({ name: "MyNestJSApp" }),
  requestScope: REQUEST
};
