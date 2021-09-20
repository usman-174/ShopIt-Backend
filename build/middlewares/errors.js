"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("../utils/errorHandler");
exports.default = (err, __, res, _) => {
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    if (process.env.NODE_ENV = 'production') {
        let error = Object.assign({}, err);
        error.message = err.message;
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid ${err.path}`;
            error = new errorHandler_1.errorHandler(message, 400);
        }
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new errorHandler_1.errorHandler(message, 400);
        }
        if (err.name === 'JsonWebTokenError') {
            const message = "Invalid JSON WEB TOKEN.Try Again!!";
            error = new errorHandler_1.errorHandler(message, 400);
        }
        if (err.name === 'TokenExpiredError') {
            const message = "Expired JSON WEB TOKEN.Try Again!!";
            error = new errorHandler_1.errorHandler(message, 400);
        }
        if (err.code === 11000 || (err.message && err.message.includes('duplicate key error collection'))) {
            const message = `Duplicated ${Object.keys(err.keyValue)} entered. `;
            error = new errorHandler_1.errorHandler(message, 400);
        }
        return res.status(error.statusCode).json({ success: false, message: error.message || "Internal Server Error." });
    }
};
//# sourceMappingURL=errors.js.map