"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsyncError_1 = __importDefault(require("../middlewares/catchAsyncError"));
const Order_1 = __importDefault(require("../models/order/Order"));
const Product_1 = __importDefault(require("../models/product/Product"));
const errorHandler_1 = require("../utils/errorHandler");
exports.createOrder = catchAsyncError_1.default(async (req, res) => {
    const order = await Order_1.default.create(Object.assign({}, req.body, { paidAt: Date.now(), user: res.locals.user._id }));
    res.status(200).json({
        success: true,
        order
    });
});
exports.getSingleOrder = catchAsyncError_1.default(async (req, res, next) => {
    const order = await Order_1.default.findById(req.params.id).populate('user');
    if (!order)
        return next(new errorHandler_1.errorHandler("Order found found invalid ID", 3404));
    return res.status(200).json({
        success: true,
        order
    });
});
exports.myOrders = catchAsyncError_1.default(async (_, res, next) => {
    const orders = await Order_1.default.find({
        user: res.locals.user._id
    });
    if (!orders || !orders.length)
        return next(new errorHandler_1.errorHandler("You haven't Ordered anything Yet. :( ", 404));
    return res.status(200).json({
        success: true,
        orders
    });
});
exports.adminAllOrders = catchAsyncError_1.default(async (_, res) => {
    const orders = await Order_1.default.find();
    let totalAmount = 0;
    orders[0] && orders.forEach(element => {
        totalAmount += element.totalPrice;
    });
    return res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});
exports.adminUpdateOrderStatus = catchAsyncError_1.default(async (req, res, next) => {
    const order = await Order_1.default.findById(req.params.id);
    if (!order)
        return next(new errorHandler_1.errorHandler("Order donot exist", 400));
    if (order.orderStatus === 'Delivered') {
        return next(new errorHandler_1.errorHandler("Order is already Delivered", 400));
    }
    order.orderStatus = req.body.orderStatus;
    order.deilveredAt = Date.now();
    await order.save({ validateModifiedOnly: true });
    if (order.orderStatus === 'Delivered') {
        order.orderItems.forEach(async (item) => {
            await updateStock(item.product, item.quantity);
        });
    }
    res.status(200).json({ success: true, order });
});
const updateStock = async (id, quantity) => {
    try {
        const product = await Product_1.default.findById(id);
        if (product) {
            product.stock = product.stock - quantity;
            await product.save({ validateModifiedOnly: true });
        }
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.adminDeleteOrder = catchAsyncError_1.default(async (req, res, next) => {
    const order = await Order_1.default.findById(req.params.id);
    if (!order)
        return next(new errorHandler_1.errorHandler("Order donot exist", 400));
    await order.remove();
    res.status(200).json({
        success: true
    });
});
//# sourceMappingURL=orderController.js.map