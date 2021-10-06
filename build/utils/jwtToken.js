"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
    console.log("Helo sending cookie :) ");
    return res.status(statusCode).cookie('token', token, {
        expires: new Date(Date.now() + parseInt(String(process.env.COOKIE_EXPIRES_TIME)) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "none",
        path: "/api",
    }).json({ success: true, user });
};
//# sourceMappingURL=jwtToken.js.map