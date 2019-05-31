import * as _Bunyan from "bunyan";
import { IncomingMessage } from "http";

export type Bunyan = _Bunyan;
export const Bunyan = _Bunyan;

export type LoggedRequest = IncomingMessage & { logger: Bunyan };
