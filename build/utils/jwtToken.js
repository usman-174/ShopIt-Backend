"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
    return res.status(statusCode).cookie('token', token, {
        expires: new Date(Date.now() + parseInt(String(process.env.COOKIE_EXPIRES_TIME)) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production" ? true : false,
        path: "/",
    }).json({ success: true, user });
};
//# sourceMappingURL=jwtToken.js.map