import { Router } from 'express'
import { authMiddleware, authorizeRoles } from '../middlewares/auth'
import { createProduct, getProductById,getAllReviews,deleteProductReview, postProductReview,getProducts, updateProduct, deleteProduct, adminGetAllProducts } from '../controllers/productController'
const productRouter = Router()


productRouter.get("/reviews", authMiddleware,  getAllReviews)
productRouter.get("/", getProducts)
productRouter.get("/admin", authMiddleware, authorizeRoles('admin'),adminGetAllProducts)
productRouter.get("/:id", getProductById)
productRouter.post("/admin/new", authMiddleware, authorizeRoles('admin'), createProduct)
productRouter.put("/review", authMiddleware,  postProductReview)
             .delete("/review",authMiddleware,deleteProductReview)
productRouter.route("/admin/:id").put(authMiddleware, authorizeRoles('admin'), updateProduct)
    .delete(authMiddleware, authorizeRoles('admin'), deleteProduct)

export default productRouter