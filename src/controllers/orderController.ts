import {
    NextFunction,
    Request,
    Response
} from "express"
import catchAsyncError from "../middlewares/catchAsyncError"
import Order from "../models/order/Order"
import Product from "../models/product/Product"
import {
    errorHandler
} from "../utils/errorHandler"

// CREATE ORDER -------------------------------------|
export const createOrder = catchAsyncError(async (req: Request, res: Response) => {
    const order = await Order.create({
        ...req.body,
        paidAt: Date.now(),
        user: res.locals.user._id
    })
    res.status(200).json({
        success: true,
        order
    })
})

// GET SINGLE ORDER BY ID -------------------------------------|
export const getSingleOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).populate('user')
    if (!order) return next(new errorHandler("Order found found invalid ID", 3404))
    
    return res.status(200).json({
        success: true,
        order
    })
})
// GET ORDERS OF logged IN USER -------------------------------------|
export const myOrders = catchAsyncError(async (_: Request, res: Response, next: NextFunction) => {
  

    const orders = await Order.find({
        user: res.locals.user._id
    })
    if (!orders || !orders.length) return next(new errorHandler("You haven't Ordered anything Yet. :( ", 404))
    return res.status(200).json({
        success: true,
        orders
    })

})

// ADMIN GET ALL ORDER --------------------------|
export const adminAllOrders = catchAsyncError(async (_: Request, res: Response) => {
    const orders = await Order.find();
    let totalAmount = 0
    orders[0] && orders.forEach(element => {
        totalAmount += element.totalPrice
    });
    return res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// ADMIN UPDATE ORDER STATUS --------------------------|
export const adminUpdateOrderStatus = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id)
    if (!order) return next(new errorHandler("Order donot exist", 400))
    if (order.orderStatus === 'Delivered') {
        return next(new errorHandler("Order is already Delivered", 400))
    }
    
    order.orderStatus = req.body.orderStatus
    order.deilveredAt = Date.now()
    await order.save({validateModifiedOnly:true})
    if(order.orderStatus=== 'Delivered'){
        order.orderItems.forEach(async (item)=>{
        
            await updateStock(item.product,item.quantity)
        })
    }
    res.status(200).json({success:true,order})
})
const updateStock = async(id:string,quantity:number)=>{
        try {
            
            const product = await Product.findById(id)
            if(product){
                product.stock = product.stock - quantity

                await product!.save({validateModifiedOnly:true})
            }
        } catch (error) {
            console.log(error.message);
            
        }
    
}

// ADMIN DELETE ORDER ===========================|
export const adminDeleteOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id)
    if(!order)return next(new errorHandler("Order donot exist",400))
    await order.remove()
   res.status(200).json({
       success:true
   })
})