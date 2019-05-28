"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const Bunyan = __importStar(require("bunyan"));
exports.DEFAULT_LOGGING_OPTIONS = {
    rootLogger: Bunyan.createLogger({ name: "MyNestJSApp" }),
    requestScope: core_1.REQUEST
};
//# sourceMappingURL=options.js.map