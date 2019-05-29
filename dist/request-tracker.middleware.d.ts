/// <reference types="node" />
import * as Bunyan from "bunyan";
import { NestMiddleware } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
export declare class RequestTrackerMiddleware implements NestMiddleware {
    constructor(rootLogger: Bunyan);
    use(req: IncomingMessage, res: ServerResponse, next: () => void): void;
}
