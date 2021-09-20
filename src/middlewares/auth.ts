import { NextFunction, Response, Request } from "express";
import JWT from "jsonwebtoken";
import User from "../models/user/User";
import { errorHandler } from "../utils/errorHandler";
import catchAsyncError from "./catchAsyncError";

export const authMiddleware = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies
    if (!token) {
        return next(new errorHandler("Please login first", 400))
    }
    const decoded = JWT.verify(token, String(process.env.JWT_SECRET)) as JWT.JwtPayload
    const user = await User.findById(decoded.id)
    if (!user) {
        return next(new errorHandler("Please login again", 401))
    }
    res.locals.user = user
    next()
}
)


export const authorizeRoles = (...roles) => {
    
    return (_: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(res.locals.user.role)) {
            return next(new errorHandler(`Role ${res.locals.user.role} is not allowed to access this route`, 403))
        }
        next()
    }
}