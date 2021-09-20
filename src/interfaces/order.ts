import { Document } from "mongoose";
import { IUser } from "./userI";

type orderItems ={
    name:string
    image:string
    quantity:number
    price:number
    product : string
}
type shippingInfo = {
    address: string
    city: string
    phoneNo: string
    postalCode:string
    country: string
}
type paymentInfo = {
    id: string
    status: string
    
}
export interface IOrder extends Document  {
    
        shippingInfo: shippingInfo
        user: IUser
        orderItems: orderItems[]
        paymentInfo: paymentInfo
        paidAt: Date
        itemsPrice: number
        taxPrice: number
        shippingPrice: number
        totalPrice: number
        orderStatus: string
        deilveredAt : Date|number
    }
