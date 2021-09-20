"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const paymentController_1 = require("../controllers/paymentController");
const paymentController = express_1.Router();
paymentController.route("/process").post(auth_1.authMiddleware, paymentController_1.processPayment);
paymentController.route("/stripeApi").get(auth_1.authMiddleware, paymentController_1.sendApiKey);
exports.default = paymentController;
//# sourceMappingURL=payment.js.map