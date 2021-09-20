"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const productController_1 = require("../controllers/productController");
const productRouter = express_1.Router();
productRouter.get("/reviews", auth_1.authMiddleware, productController_1.getAllReviews);
productRouter.get("/", productController_1.getProducts);
productRouter.get("/admin", auth_1.authMiddleware, auth_1.authorizeRoles('admin'), productController_1.adminGetAllProducts);
productRouter.get("/:id", productController_1.getProductById);
productRouter.post("/admin/new", auth_1.authMiddleware, auth_1.authorizeRoles('admin'), productController_1.createProduct);
productRouter.put("/review", auth_1.authMiddleware, productController_1.postProductReview)
    .delete("/review", auth_1.authMiddleware, productController_1.deleteProductReview);
productRouter.route("/admin/:id").put(auth_1.authMiddleware, auth_1.authorizeRoles('admin'), productController_1.updateProduct)
    .delete(auth_1.authMiddleware, auth_1.authorizeRoles('admin'), productController_1.deleteProduct);
exports.default = productRouter;
//# sourceMappingURL=products.js.map