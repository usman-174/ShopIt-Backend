import {
    Router
} from 'express'
import {
    authMiddleware
} from '../middlewares/auth'
import {
    processPayment, sendApiKey
} from '../controllers/paymentController'
const paymentController = Router()

paymentController.route("/process").post(authMiddleware, processPayment)
paymentController.route("/stripeApi").get(authMiddleware, sendApiKey)

export default paymentController