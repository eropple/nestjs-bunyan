"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bunyan = __importStar(require("bunyan"));
const common_1 = require("@nestjs/common");
const http_1 = require("http");
const injector_decorations_1 = require("./injector-decorations");
const core_1 = require("@nestjs/core");
let RequestTrackerMiddleware = class RequestTrackerMiddleware {
    constructor(rootLogger, logger, options, request) {
        console.log("RequestTrackerMiddleware request: ", request);
    }
    use(req, res, next) {
        const start = new Date();
        const data = {};
        data.method = req.method;
        data.url = req.url;
        data.ip = req.connection.remoteAddress;
        console.log(data);
        next();
        const ms = (new Date()).valueOf() - start.valueOf();
        console.log(ms);
    }
};
RequestTrackerMiddleware = __decorate([
    common_1.Injectable({ scope: common_1.Scope.REQUEST }),
    __param(0, injector_decorations_1.RootLogger()),
    __param(1, injector_decorations_1.Logger()),
    __param(2, injector_decorations_1.LoggingOptions()),
    __param(3, common_1.Inject(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, Object, Object, http_1.IncomingMessage])
], RequestTrackerMiddleware);
exports.RequestTrackerMiddleware = RequestTrackerMiddleware;
//# sourceMappingURL=request-tracker.middleware.js.map