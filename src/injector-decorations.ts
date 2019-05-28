import { Inject } from "@nestjs/common";

import { ROOT_LOGGER, LOGGING_OPTIONS, LOGGER } from "./injector-keys";

export function RootLogger() {
  return Inject(ROOT_LOGGER);
}

export function LoggingOptions() {
  return Inject(LOGGING_OPTIONS);
}

export function Logger() {
  return Inject(LOGGER);
}
