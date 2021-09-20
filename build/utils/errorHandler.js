"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class errorHandler extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map