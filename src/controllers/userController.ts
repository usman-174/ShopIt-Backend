import { errorHandler } from './../utils/errorHandler';
import { Request, Response, NextFunction } from 'express'
import bcryptjs from 'bcryptjs'
import User from '../models/user/User'
import CatchError from '../middlewares/catchAsyncError'
import validator from 'validator'
import crypto from 'crypto'
import { sendToken } from '../utils/jwtToken';
import { sendEmail } from '../utils/sendEmail';
import catchAsyncError from '../middlewares/catchAsyncError';
import {  IUser } from '../interfaces/userI';
import { saveImage,destroyImage } from '../utils/Cloudinary';
// Register ROUTE -----------------------------c
export const register = CatchError(async (req: Request, res: Response,next:NextFunction) => {
    const { name, avatar, email, password, role } = req.body
    console.log("avatar=",avatar)
    let userData = { name, email, password, 
        role: role && role.length >= 4 ? role : undefined,
        avatar : {public_id:"",url:""}
    }
    const usersCount = await User.countDocuments()
    if(usersCount < 1){
        userData.role="admin"
    }
    if(avatar){
        const response = await saveImage(avatar,next,"avatars") 
        userData.avatar=  { public_id : response!.public_id, url:response!.url } as any
    }else{
        userData.avatar = { public_id : "avatars/q0lqv7v93visbefxvosq", url:"https://res.cloudinary.com/ds4zbyupc/image/upload/v1630350541/avatars/q0lqv7v93visbefxvosq.png" }
    }
    const user = await User.create(userData)
    sendToken(user, 200, res)
})

// LOGIN ROUTE -----------------------------c
export const login = CatchError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    if (!email && !password) {
        return next(new errorHandler("Please enter Email & Password", 400))
    } else if (!email) {
        return next(new errorHandler("Please enter Email", 400))
    } else if (!password) {
        return next(new errorHandler("Please enter Password", 400))
    } else if (!validator.isEmail(email)) {
        return next(new errorHandler("Please enter a valid Email", 400))
    } else {
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return next(new errorHandler("Invalid Email or Password", 401))
        }
        const match = await bcryptjs.compare(password,String(user.password))
        if (!match) {
            return next(new errorHandler("Invalid Email or Password", 401))
        }
        sendToken(user, 200, res)
    }

})



// FORGOT PASSWORD ROUTE -----------------------------c
export const forgotPassword = CatchError(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    
    const user = await User.findOne({ email })
    if (!user) return next(new errorHandler("This Email do not exist", 400))
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })
    const resetUrl = `${process.env.ORIGIN}/reset-password/${resetToken}`
    const message = `Your password reset token is as follow \n\n ${resetUrl} \n. If you did not request this email then please ignore this mail.`
    try {
        await sendEmail({ email: user.email, message, subject: "Password forget",resetUrl })
        return res.status(203).json({ success: true, message: `Please check you email at ${user.email} for password recovery` })
    } catch (error) {
        user.resetPasswordExpire = undefined as undefined
        user.resetPasswordToken = undefined as undefined
        await user.save({ validateBeforeSave: false })
        return next(new errorHandler(error.message, 500))

    }
})


// Reset Password ROUTE -----------------------------c
export const ResetPassword = CatchError(async (req: Request, res: Response, next: NextFunction) => {
    
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: new Date(Date.now()) }
    })
    if (!user) {
        return next(new errorHandler('The toke is invalid or expired', 400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new errorHandler('Passwords donot match.', 400))
    }
    user.password = req.body.password
   delete user.resetPasswordExpire 
   delete user.resetPasswordToken 
    await user.save({ validateBeforeSave: false })
    sendToken(user, 200, res)

})
// GET CURRENT USER ROUTE -----------------------------c
export const getCurrentUser = catchAsyncError(async (_: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(res.locals.user._id)
    if (!user) return next(new errorHandler("Please login again", 400))
    res.status(200).json({ success: true, user })
})
// GET CURRENT USER ROUTE -----------------------------c
export const updatePassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword, confirmPassword } = req.body
    if (newPassword !== confirmPassword) {
        return next(new errorHandler("Passwords donot match", 400))
    }
    const user = await User.findById(res.locals.user._id).select("+password")

    const match = user!.comparePasswords(oldPassword)
    if (!match) return next(new errorHandler("Invalid old password", 400))
    user!.password = newPassword as string
    await user!.save()
    sendToken(user as IUser, 200, res)


}) 
// Profile Update ROUTE -----------------------------c
export const profileUpdate = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    
    let profileData : {email?:string,name?:string,avatar ? : {public_id?:string,url?:string}} = {
        name: req.body.name || res.locals.user.name || undefined,
        email: req.body.email || res.locals.user.email || undefined,
        avatar:{}
    }
   

    if(!req.body.email.includes("@")){
        return next(new errorHandler("Please Enter a valid Email.", 400))
    }

        console.log("avatar=",req.body.avatar);
        console.log("typeof avatar=",typeof req.body.avatar);
        
    if(typeof req.body.avatar !== "undefined" ){
        console.log("Req.Body.Avatar Found")
    
        const currentUser = await User.findById(res.locals.user._id)
        const image_id= (currentUser as IUser).avatar.public_id
        if(!image_id.includes("q0lqv7v93visbefxvosq")){
                console.log('Destrying Old Image');
                
            await destroyImage(image_id,next)
        }
        
        const response= await saveImage(req.body.avatar,next,"avatars") 
        if(response){
            console.log("Image uploaded to cloudinaruy")

            profileData.avatar = {
                public_id: response.public_id,
                url: response.secure_url
            }
        }else{
            delete profileData.avatar
        }
        
    }else{
        delete profileData.avatar
    }
    const user = await User.findByIdAndUpdate(res.locals.user._id, (profileData as any), {
        new: true, runValidators: true, useFindAndModify: false
    })
    return res.status(200).json({ success: true, user })
})
// ADMUN UPDATE USER ROUTE -----------------------------c
export const AdminUpdateUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    let user = await User.findById(req.params.id)
    const profileData = {
        name: req.body.name || user!.name || undefined,
        email: req.body.email || user!.email || undefined,
        role: req.body.role || user!.role || undefined
    }
    if (!user) return next("user not found")
    if (req.body.name && user.name === req.body.name) {
        return next(new errorHandler("Name cannot be same as before", 400))
    }
    if (req.body.email && user.email === req.body.email) {
        return next(new errorHandler("Email cannot be same as before", 400))
    }
    user = await User.findByIdAndUpdate(req.params.id, profileData, {
        new: true, runValidators: true, useFindAndModify: false
    })
    return res.status(200).json({ success: true, user })
})
// GET ALL USERS ROUTE -----------------------------c
export const getAllUsers = catchAsyncError(async (_: Request, res: Response) => {
    const users = await User.find()
    res.status(200).json({ success: true, users })
})
// GET USER BY ID ROUTE -----------------------------c

export const getUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const user = await User.findById(req.params.id)
    if (!user) return next(new errorHandler("User not found"))
    res.status(200).json({ success: true, user })
})
// ADMIN DELETE USER BY ID ROUTE -----------------------------c

export const AdminDeleteUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const user = await User.findById(req.params.id)
    if (!user) return next(new errorHandler("User not found"))
    await user.remove()
    res.status(200).json({ success: true })
})
// LOGOUT ROUTE -----------------------------c
export const Logout = CatchError(async (_: Request, res: Response,) => {
    res.locals.user = undefined
    res.cookie('token', null, {
        expires: new Date(Date.now())
    }).json({ success: true })

})