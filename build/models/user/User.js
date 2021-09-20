"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        maxLength: [30, "Name cannot exceed 30 characters"],
        required: [true, "Please enter name."],
    },
    email: {
        type: String,
        required: [true, "Please enter your email."],
        unique: true,
        validate: [validator_1.default.isEmail, 'Please enter a valid Email.']
    },
    password: {
        type: String,
        minlength: [6, 'Password length must be longer than 6 characters.'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user',
        enum: {
            values: [
                "admin",
                "user",
            ], message: "Please select the correct role.",
        }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    ;
    this.password = await bcryptjs_1.default.hash(String(this.password), 10);
});
UserSchema.methods.getJwtToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, String(process.env.JWT_SECRET), {
        expiresIn: process.env.JWT_EXPIREIN
    });
};
UserSchema.methods.comparePasswords = async function (enteredPass) {
    return await bcryptjs_1.default.compare(enteredPass, this.password);
};
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto_1.default.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return resetToken;
};
const User = mongoose_1.model("User", UserSchema);
exports.default = User;
//# sourceMappingURL=User.js.map