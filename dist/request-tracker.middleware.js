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
const injector_decorations_1 = require("./injector-decorations");
let RequestTrackerMiddleware = class RequestTrackerMiddleware {
    constructor(rootLogger) {
        console.log("RequestTrackerMiddleware typeof(rootLogger): ", typeof (rootLogger));
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
    common_1.Injectable(),
    __param(0, injector_decorations_1.RootLogger()),
    __metadata("design:paramtypes", [Object])
], RequestTrackerMiddleware);
exports.RequestTrackerMiddleware = RequestTrackerMiddleware;
//# sourceMappingURL=request-tracker.middleware.js.map