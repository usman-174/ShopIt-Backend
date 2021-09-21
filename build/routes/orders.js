"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./../middlewares/auth");
const express_1 = require("express");
const auth_2 = require("../middlewares/auth");
const orderController_1 = require("../controllers/orderController");
const orderController = express_1.Router();
orderController.route("/admin").get(auth_2.authMiddleware, auth_1.authorizeRoles('admin'), orderController_1.adminAllOrders);
orderController.get("/my", auth_2.authMiddleware, orderController_1.myOrders);
orderController.route("/admin/:id").put(auth_2.authMiddleware, auth_1.authorizeRoles('admin'), orderController_1.adminUpdateOrderStatus).delete(auth_2.authMiddleware, auth_1.authorizeRoles('admin'), orderController_1.adminDeleteOrder);
orderController.route("/:id").get(auth_2.authMiddleware, auth_1.authorizeRoles('admin'), orderController_1.getSingleOrder);
orderController.route("/create").post(auth_2.authMiddleware, orderController_1.createOrder);
exports.default = orderController;
//# sourceMappingURL=orders.js.map