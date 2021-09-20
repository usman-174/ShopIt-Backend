"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const catchAsyncError_1 = __importDefault(require("../middlewares/catchAsyncError"));
const stripe_1 = __importDefault(require("stripe"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
});
exports.processPayment = catchAsyncError_1.default(async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        metadata: { integration_check: 'accept_a_payment' }
    });
    res.status(200).json({ success: true, clientsecret: paymentIntent.client_secret });
});
exports.sendApiKey = catchAsyncError_1.default(async (_, res) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
//# sourceMappingURL=paymentController.js.map