import { model, Schema, Model } from "mongoose";
import { IUser } from "../../interfaces/userI";
import validator from 'validator'
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
const UserSchema: Schema = new Schema(
    {
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
            validate: [validator.isEmail, 'Please enter a valid Email.']
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

    },
    { timestamps: true }
);


UserSchema.pre('save', async function (this: IUser, next) {
    if (!this.isModified('password')) {
        next()
    };
    
    this.password = await bcryptjs.hashSync(String(this.password))
})
UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, String(process.env.JWT_SECRET), {
        expiresIn: process.env.JWT_EXPIREIN
    })
}
UserSchema.methods.comparePasswords = async function (this:any, enteredPass: string) {
    return await bcryptjs.compare(enteredPass, this.password )

}
UserSchema.methods.getResetPasswordToken = function (this:any) {
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire = Date.now() + 30 *60*1000
    return resetToken
}
const User: Model<IUser> = model<IUser>("User", UserSchema);

export default User;
