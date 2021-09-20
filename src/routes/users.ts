import { register, login, Logout, getAllUsers, AdminDeleteUser, getUser, updatePassword, AdminUpdateUser, forgotPassword, profileUpdate, getCurrentUser, ResetPassword } from './../controllers/userController';
import { Router } from 'express'
import { authMiddleware, authorizeRoles } from '../middlewares/auth';
const userRouter = Router()



userRouter.route('/register').post(register)
userRouter.route('/login').post(login)
userRouter.route('/logout').get(Logout)
userRouter.route('/forgot-password').post(forgotPassword)
userRouter.route('/reset-password/:token').put(ResetPassword)
userRouter.route("/me").get(authMiddleware, getCurrentUser)
userRouter.route("/update-password").put(authMiddleware, updatePassword)
userRouter.route("/update-profile").put(authMiddleware, profileUpdate)
userRouter.route("/admin/users").get(authMiddleware, authorizeRoles("admin"), getAllUsers)
userRouter.route("/admin/user/:id").get(authMiddleware, authorizeRoles("admin"), getUser)
                .put(authMiddleware, authorizeRoles("admin"), AdminUpdateUser)
                .delete(authMiddleware, authorizeRoles("admin"), AdminDeleteUser)

export default userRouter