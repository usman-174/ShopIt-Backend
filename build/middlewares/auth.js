"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/user/User"));
const errorHandler_1 = require("../utils/errorHandler");
const catchAsyncError_1 = __importDefault(require("./catchAsyncError"));
exports.authMiddleware = catchAsyncError_1.default(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new errorHandler_1.errorHandler("Please login first", 400));
    }
    const decoded = jsonwebtoken_1.default.verify(token, String(process.env.JWT_SECRET));
    const user = await User_1.default.findById(decoded.id);
    if (!user) {
        return next(new errorHandler_1.errorHandler("Please login again", 401));
    }
    res.locals.user = user;
    next();
});
exports.authorizeRoles = (...roles) => {
    return (_, res, next) => {
        if (!roles.includes(res.locals.user.role)) {
            return next(new errorHandler_1.errorHandler(`Role ${res.locals.user.role} is not allowed to access this route`, 403));
        }
        next();
    };
};
//# sourceMappingURL=auth.js.map