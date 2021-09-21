"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.sendEmail = async (options) => {
    const transport = nodemailer_1.default.createTransport({
        service: "gmail",
        host: 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    const message = {
        from: `${process.env.SMTP_FROM_EMAIL} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `<a href="${options.resetUrl}" >${options.message}</a>`
    };
    await transport.sendMail(message);
};
//# sourceMappingURL=sendEmail.js.map