"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("./../utils/errorHandler");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/user/User"));
const catchAsyncError_1 = __importDefault(require("../middlewares/catchAsyncError"));
const validator_1 = __importDefault(require("validator"));
const crypto_1 = __importDefault(require("crypto"));
const jwtToken_1 = require("../utils/jwtToken");
const sendEmail_1 = require("../utils/sendEmail");
const catchAsyncError_2 = __importDefault(require("../middlewares/catchAsyncError"));
const Cloudinary_1 = require("../utils/Cloudinary");
exports.register = catchAsyncError_1.default(async (req, res, next) => {
    const { name, avatar, email, password, role } = req.body;
    console.log("avatar=", avatar);
    let userData = { name, email, password,
        role: role && role.length >= 4 ? role : undefined,
        avatar: { public_id: "", url: "" }
    };
    const usersCount = await User_1.default.countDocuments();
    if (usersCount < 1) {
        userData.role = "admin";
    }
    if (avatar) {
        const response = await Cloudinary_1.saveImage(avatar, next, "avatars");
        userData.avatar = { public_id: response.public_id, url: response.url };
    }
    else {
        userData.avatar = { public_id: "avatars/q0lqv7v93visbefxvosq", url: "https://res.cloudinary.com/ds4zbyupc/image/upload/v1630350541/avatars/q0lqv7v93visbefxvosq.png" };
    }
    const user = await User_1.default.create(userData);
    jwtToken_1.sendToken(user, 200, res);
});
exports.login = catchAsyncError_1.default(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email && !password) {
        return next(new errorHandler_1.errorHandler("Please enter Email & Password", 400));
    }
    else if (!email) {
        return next(new errorHandler_1.errorHandler("Please enter Email", 400));
    }
    else if (!password) {
        return next(new errorHandler_1.errorHandler("Please enter Password", 400));
    }
    else if (!validator_1.default.isEmail(email)) {
        return next(new errorHandler_1.errorHandler("Please enter a valid Email", 400));
    }
    else {
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return next(new errorHandler_1.errorHandler("Invalid Email or Password", 401));
        }
        const match = await bcryptjs_1.default.compare(password, String(user.password));
        if (!match) {
            return next(new errorHandler_1.errorHandler("Invalid Email or Password", 401));
        }
        user.password = undefined;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        jwtToken_1.sendToken(user, 200, res);
    }
});
exports.forgotPassword = catchAsyncError_1.default(async (req, res, next) => {
    const { email } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user)
        return next(new errorHandler_1.errorHandler("This Email do not exist", 400));
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.ORIGIN}/reset-password/${resetToken}`;
    const message = `Your password reset token is as follow \n\n ${resetUrl} \n. If you did not request this email then please ignore this mail.`;
    try {
        await sendEmail_1.sendEmail({ email: user.email, message, subject: "Password forget", resetUrl });
        return res.status(203).json({ success: true, message: `Please check you email at ${user.email} for password recovery` });
    }
    catch (error) {
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new errorHandler_1.errorHandler(error.message, 500));
    }
});
exports.ResetPassword = catchAsyncError_1.default(async (req, res, next) => {
    const resetPasswordToken = crypto_1.default.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User_1.default.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: new Date(Date.now()) }
    });
    if (!user) {
        return next(new errorHandler_1.errorHandler('The toke is invalid or expired', 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new errorHandler_1.errorHandler('Passwords donot match.', 400));
    }
    user.password = req.body.password;
    delete user.resetPasswordExpire;
    delete user.resetPasswordToken;
    await user.save({ validateBeforeSave: false });
    jwtToken_1.sendToken(user, 200, res);
});
exports.getCurrentUser = catchAsyncError_2.default(async (_, res, next) => {
    const user = await User_1.default.findById(res.locals.user._id);
    if (!user)
        return next(new errorHandler_1.errorHandler("Please login again", 400));
    res.status(200).json({ success: true, user });
});
exports.updatePassword = catchAsyncError_2.default(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
        return next(new errorHandler_1.errorHandler("Passwords donot match", 400));
    }
    const user = await User_1.default.findById(res.locals.user._id).select("+password");
    const match = user.comparePasswords(oldPassword);
    if (!match)
        return next(new errorHandler_1.errorHandler("Invalid old password", 400));
    user.password = newPassword;
    await user.save();
    jwtToken_1.sendToken(user, 200, res);
});
exports.profileUpdate = catchAsyncError_2.default(async (req, res, next) => {
    let profileData = {
        name: req.body.name || res.locals.user.name || undefined,
        email: req.body.email || res.locals.user.email || undefined,
        avatar: {}
    };
    if (!req.body.email.includes("@")) {
        return next(new errorHandler_1.errorHandler("Please Enter a valid Email.", 400));
    }
    console.log("avatar=", req.body.avatar);
    console.log("typeof avatar=", typeof req.body.avatar);
    if (typeof req.body.avatar !== "undefined") {
        console.log("Req.Body.Avatar Found");
        const currentUser = await User_1.default.findById(res.locals.user._id);
        const image_id = currentUser.avatar.public_id;
        if (!image_id.includes("q0lqv7v93visbefxvosq")) {
            console.log('Destrying Old Image');
            await Cloudinary_1.destroyImage(image_id, next);
        }
        const response = await Cloudinary_1.saveImage(req.body.avatar, next, "avatars");
        if (response) {
            console.log("Image uploaded to cloudinaruy");
            profileData.avatar = {
                public_id: response.public_id,
                url: response.url
            };
        }
        else {
            delete profileData.avatar;
        }
    }
    else {
        delete profileData.avatar;
    }
    console.log('ProfileData=', profileData);
    const user = await User_1.default.findByIdAndUpdate(res.locals.user._id, profileData, {
        new: true, runValidators: true, useFindAndModify: false
    });
    return res.status(200).json({ success: true, user });
});
exports.AdminUpdateUser = catchAsyncError_2.default(async (req, res, next) => {
    let user = await User_1.default.findById(req.params.id);
    const profileData = {
        name: req.body.name || user.name || undefined,
        email: req.body.email || user.email || undefined,
        role: req.body.role || user.role || undefined
    };
    if (!user)
        return next("user not found");
    if (req.body.name && user.name === req.body.name) {
        return next(new errorHandler_1.errorHandler("Name cannot be same as before", 400));
    }
    if (req.body.email && user.email === req.body.email) {
        return next(new errorHandler_1.errorHandler("Email cannot be same as before", 400));
    }
    user = await User_1.default.findByIdAndUpdate(req.params.id, profileData, {
        new: true, runValidators: true, useFindAndModify: false
    });
    return res.status(200).json({ success: true, user });
});
exports.getAllUsers = catchAsyncError_2.default(async (_, res) => {
    const users = await User_1.default.find();
    res.status(200).json({ success: true, users });
});
exports.getUser = catchAsyncError_2.default(async (req, res, next) => {
    const user = await User_1.default.findById(req.params.id);
    if (!user)
        return next(new errorHandler_1.errorHandler("User not found"));
    res.status(200).json({ success: true, user });
});
exports.AdminDeleteUser = catchAsyncError_2.default(async (req, res, next) => {
    const user = await User_1.default.findById(req.params.id);
    if (!user)
        return next(new errorHandler_1.errorHandler("User not found"));
    await user.remove();
    res.status(200).json({ success: true });
});
exports.Logout = catchAsyncError_1.default(async (_, res) => {
    res.locals.user = undefined;
    res.cookie('token', null, {
        expires: new Date(Date.now())
    }).json({ success: true });
});
//# sourceMappingURL=userController.js.map