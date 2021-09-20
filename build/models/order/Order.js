"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    orderItems: [
        {
            name: { type: String, required: true },
            image: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
        }
    ],
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String
        }
    },
    paidAt: {
        type: Date
    },
    itemsPrice: {
        type: Number,
        requied: true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        requied: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        requied: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        requied: true,
        default: 0.0
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing'
    },
    deilveredAt: {
        type: Date
    }
}, { timestamps: true });
const Order = mongoose_1.model("Order", OrderSchema);
exports.default = Order;
//# sourceMappingURL=Order.js.map