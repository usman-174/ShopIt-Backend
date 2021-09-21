import connectDatabase from './config/database'
import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRouter from "./routes/products";
import orderRouter from "./routes/orders";
import userRouter from "./routes/users";
import ErrorMiddleware from "./middlewares/errors"
import cookieParser from 'cookie-parser'
import cloud from './utils/Cloudinary'
import fileUpload from 'express-fileupload'
import paymentController from './routes/payment';

if( process.env.NODE_ENV !== "production"){
  dotenv.config();
}

const PORT = process.env.PORT || 4000;

const app = express();
cloud()
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended:true,limit: '50mb'}))
app.use(cookieParser())
app.use(fileUpload())
app.use(
  cors({
    credentials: true,
    origin:
    process.env.NODE_ENV === "production"
    ? process.env.ORIGIN
    : 'http://localhost:3000',
    optionsSuccessStatus: 200,
  })
  );
 
  
  process.on('uncaughtException', (err: any) => {
    console.log(`Error = ${err.message}`);
    console.log('Shutting down server due to uncaughtException Error');
  
    process.exit(1)
  })

app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/payment', paymentController)
app.use(ErrorMiddleware)

const server = app.listen(PORT, async () => {
connectDatabase()

  console.log(`Server running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});

process.on('unhandledRejection', (err: any) => {
  console.error("Error Message = " + err.message);
  console.error("Error Stack = " + err.stack);
  server.close(() => {
    console.log('Shutting down server due to unhandledRejection Error');
    process.exit(1)
  })
})