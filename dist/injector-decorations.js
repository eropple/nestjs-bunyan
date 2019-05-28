"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const injector_keys_1 = require("./injector-keys");
function RootLogger() {
    return common_1.Inject(injector_keys_1.ROOT_LOGGER);
}
exports.RootLogger = RootLogger;
function LoggingOptions() {
    return common_1.Inject(injector_keys_1.LOGGING_OPTIONS);
}
exports.LoggingOptions = LoggingOptions;
function Logger() {
    return common_1.Inject(injector_keys_1.LOGGER);
}
exports.Logger = Logger;
//# sourceMappingURL=injector-decorations.js.map