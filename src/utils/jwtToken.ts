import { Response } from "express";
import { IUser } from "../interfaces/userI";

export const sendToken = (user:IUser,statusCode:number,res:Response)=>{
    const token = user.getJwtToken()
   
    return res.status(statusCode).cookie('token',token,{
        expires : new Date(Date.now() + parseInt(String(process.env.COOKIE_EXPIRES_TIME)) * 24*60*60 *1000),
        httpOnly:true, 
        sameSite: "none",
        path:"/api",
         
    }).json({success:true,user})
}