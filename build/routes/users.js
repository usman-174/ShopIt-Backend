"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("./../controllers/userController");
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const userRouter = express_1.Router();
userRouter.route('/register').post(userController_1.register);
userRouter.route('/login').post(userController_1.login);
userRouter.route('/logout').get(userController_1.Logout);
userRouter.route('/forgot-password').post(userController_1.forgotPassword);
userRouter.route('/reset-password/:token').put(userController_1.ResetPassword);
userRouter.route("/me").get(auth_1.authMiddleware, userController_1.getCurrentUser);
userRouter.route("/update-password").put(auth_1.authMiddleware, userController_1.updatePassword);
userRouter.route("/update-profile").put(auth_1.authMiddleware, userController_1.profileUpdate);
userRouter.route("/admin/users").get(auth_1.authMiddleware, auth_1.authorizeRoles("admin"), userController_1.getAllUsers);
userRouter.route("/admin/user/:id").get(auth_1.authMiddleware, auth_1.authorizeRoles("admin"), userController_1.getUser)
    .put(auth_1.authMiddleware, auth_1.authorizeRoles("admin"), userController_1.AdminUpdateUser)
    .delete(auth_1.authMiddleware, auth_1.authorizeRoles("admin"), userController_1.AdminDeleteUser);
exports.default = userRouter;
//# sourceMappingURL=users.js.map