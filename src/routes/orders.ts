import {
    authorizeRoles
} from './../middlewares/auth';
import {
    Router
} from 'express'
import {
    authMiddleware
} from '../middlewares/auth'
import {
    createOrder,
    adminUpdateOrderStatus,
    getSingleOrder,
    myOrders,adminDeleteOrder,
    adminAllOrders
} from '../controllers/orderController'
const orderController = Router()


orderController.route("/admin").get(authMiddleware, authorizeRoles('admin'), adminAllOrders)

orderController.get("/my",authMiddleware, myOrders)
// orderController.route("/delivered/:id")
orderController.route("/admin/:id").put(authMiddleware, authorizeRoles('admin'), adminUpdateOrderStatus).delete(authMiddleware, authorizeRoles('admin'), adminDeleteOrder)

orderController.route("/:id").get(authMiddleware, authorizeRoles('admin'), getSingleOrder)

orderController.route("/create").post(authMiddleware, createOrder)


export default orderController