import { Inject } from "@nestjs/common";

import { ROOT_LOGGER, LOGGER } from "./injector-keys";

export function RootLogger() {
  return Inject(ROOT_LOGGER);
}

export function Logger() {
  return Inject(LOGGER);
}
