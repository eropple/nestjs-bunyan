/// <reference types="node" />
import * as Bunyan from "bunyan";
import { NestMiddleware } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { LoggingOptions as Options } from "./options";
export declare class RequestTrackerMiddleware implements NestMiddleware {
    constructor(rootLogger: Bunyan, logger: Bunyan, options: Options, request: IncomingMessage);
    use(req: IncomingMessage, res: ServerResponse, next: () => void): void;
}
