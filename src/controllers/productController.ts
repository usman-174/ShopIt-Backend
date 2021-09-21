import {
    ApiFeatures
} from '../utils/apiFeatures';
import {
    NextFunction,
    Request,
    Response
} from "express";
import Product from "../models/product/Product";
import {
    errorHandler
} from '../utils/errorHandler'
import CatchError from '../middlewares/catchAsyncError'
import { destroyImage, saveImage } from '../utils/Cloudinary';
// GET PRODUCT ------------------------------
export const getProducts = CatchError(async (req: Request, res: Response) => {
    const resPerPage = 4;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage)
    products = await apiFeatures.query;


    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        products
    })

})
// ADMIN CREATE PRODUCT------------------------
export const createProduct = CatchError(async (req: Request, res: Response,next:NextFunction) => {
    let images : any[] = []
    if(typeof req.body.images === "string"){
        images.push(req.body.images)
    }else{
        images = req.body.images
    }
    let imagesLink : any = []
    for (let i = 0; i < images.length; i++) {
        const response = await saveImage(images[i],next,'products')
        if(response){
            imagesLink.push({
                public_id:response.public_id as string,
                url:response.url as string
            })
        }
    }
    req.body.images=imagesLink
    req.body.user = res.locals.user._id
    req.body.seller = res.locals.user.name
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })

})
// GET PRODUCT BY ID =========================
export const getProductById = CatchError(async (req: Request, res: Response, next: NextFunction) => {

    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new errorHandler("Product not found", 404))
    }
    return res.status(201).json({
        success: true,
        product
    })

})
// ADMIN UPDATE PRODUCT -------------------------
export const updateProduct = CatchError(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id)
    
    if (!product) {
        return next(new errorHandler("Product not found", 404))
    }
    let images : any[] = []
    if(typeof req.body.images === "string"){
        images.push(req.body.images)
    }else{
        images = req.body.images
    }
    if(images !== undefined){
        for (let i = 0; i < product.images.length; i++) {
            await destroyImage(product.images[i].public_id,next)
       }
       let imagesLink : any = []
       for (let i = 0; i < images.length; i++) {
           const response = await saveImage(images[i],next,'products')
           if(response){
               imagesLink.push({
                   public_id:response.public_id as string,
                   url:response.url as string
               })
           }
       }
       req.body.images=imagesLink
   
    }
   
    const newproduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        useFindAndModify: false,
        runValidators: true,
        new: true
    })

    return res.status(201).json({
        success: true,
        product:newproduct
    })


})
// ADMIN DELETE PRODUCT -----------------
export const deleteProduct = CatchError(async (req: Request, res: Response,next:NextFunction) => {

    const product = await Product.findById(req.params.id)
    if(!product) return next(new errorHandler("Product not found.",404))
    for (let i = 0; i < product.images.length; i++) {
         await destroyImage(product.images[i].public_id,next)
        
    }
    await product.remove()
    return res.json({
        success: true
    })

})
// ADMIN GET ALL PRODUCTS
export const adminGetAllProducts =  CatchError(async (_: Request, res: Response) => {

    const products = await Product.find()
    return res.json({
        success: true,
        products
    })

})
// USER CREATE A PRODUCT REVIEW ==========================
export const postProductReview = CatchError(async (req: Request, res: Response, next: NextFunction) => {
    const {
        rating,
        productId
    } = req.body
    const review = {
        rating: Number(rating),
        comment:req.body.review,
        user: res.locals.user._id,
        name: res.locals.user.name
    }
    if (rating > 5) {
        next(new errorHandler("Rating cannot be above than 5 points.", 400))
    }
    const product = await Product.findById(productId)
    if (!product) return next(new errorHandler("Product not found", 400))
    const isReviewed = product.reviews.find(review => review.user.toString() === res.locals.user._id.toString())

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === res.locals.user._id.toString()) {
                review.comment = req.body.review
                review.rating = rating
            }
        })
    } else {
        product.reviews.push(review)
    }
    product.numOfReviews = product.reviews.length
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
    await product.save({
        validateModifiedOnly: true
    })
    res.status(200).json({
        success: true
    })

})
// GET ALL PRODUCT REVIEWS ==========================
export const getAllReviews = CatchError(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.query.id)
    if (!product) return next(new errorHandler("Product not found", 400))

    res.status(200).json({
        success: true,
        reviews: product!.reviews
    })
})
// DELETE PRODUCT REVIEW
export const deleteProductReview = CatchError(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.query.productId)
    if (!product) return next(new errorHandler("Product not found", 400))
    product.reviews = product.reviews.filter(review => {
        review!._id!.toString() !== req.query!.id
    })


    product.numOfReviews = product.reviews.length
    product.ratings = Number(product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length)



    await product.save({ validateModifiedOnly: true })
    res.status(200).json({
        success: true
    })
})