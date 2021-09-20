import { model, Schema, Model } from "mongoose";
import { IOrder } from '../../interfaces/order';



const OrderSchema: Schema = new Schema(
    {
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
            type: Schema.Types.ObjectId,
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
                    type: Schema.Types.ObjectId,
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
            default:'Processing'
        },
        deilveredAt : {
            type:Date
        }
    },
    { timestamps: true }
);

const Order: Model<IOrder> = model("Order", OrderSchema);

export default Order;
