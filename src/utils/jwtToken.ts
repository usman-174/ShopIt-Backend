import { CookieOptions, Response } from "express";
import { IUser } from "../interfaces/userI";

export const sendToken = (user:IUser,statusCode:number,res:Response)=>{
    const token = user.getJwtToken()
    user.password = undefined
    const options :CookieOptions= {
        expires : new Date(Date.now() + parseInt(String(process.env.COOKIE_EXPIRES_TIME)) * 24*60*60 *1000),
        httpOnly:true, 
        
    }
    return res.status(statusCode).cookie('token',token,options).json({success:true,user,token})
}