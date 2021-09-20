import { Document } from "mongoose"



export type Avatar = {
    public_id: string
    url: string
}

enum Roles {
    User = "user",
    Admin = "admin",
   
}
export interface IUser extends Document {
    _id:string
    avatar: Avatar
    name: string,
    email: string,
    password?: string,
    role: Roles
    resetPasswordToken:string|undefined
    resetPasswordExpire:Date|undefined
    getJwtToken() : string
    getResetPasswordToken() : string
    comparePasswords(password:string): boolean
}