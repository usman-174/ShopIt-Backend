import {  Request, Response } from "express"
import dotenv from "dotenv";
import catchAsyncError from "../middlewares/catchAsyncError"
import Stripe from 'stripe';

if( process.env.NODE_ENV !== "production"){
    dotenv.config();
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,{
    apiVersion: '2020-08-27',
  });

// STRIPE PAYMENT CONTROLLER-----> /api/payment/process

export const processPayment= catchAsyncError(async(req:Request,res:Response)=>{
    const paymentIntent = await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency  : "usd",
        metadata : {integration_check : 'accept_a_payment'}
    })
    res.status(200).json({success:true,clientsecret:paymentIntent.client_secret})
})
// SEND STRIPE API KEY CONTROLLER-----> /api/payment/stripeApi

export const sendApiKey= catchAsyncError(async(_:Request,res:Response)=>{
   
    res.status(200).json({stripeApiKey:process.env.STRIPE_API_KEY})
})