"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
    user.password = undefined;
    const options = {
        expires: new Date(Date.now() + parseInt(String(process.env.COOKIE_EXPIRES_TIME)) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
    };
    return res.status(statusCode).cookie('token', token, options).json({ success: true, user, token });
};
//# sourceMappingURL=jwtToken.js.map