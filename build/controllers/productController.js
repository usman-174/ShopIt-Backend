"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiFeatures_1 = require("../utils/apiFeatures");
const Product_1 = __importDefault(require("../models/product/Product"));
const errorHandler_1 = require("../utils/errorHandler");
const catchAsyncError_1 = __importDefault(require("../middlewares/catchAsyncError"));
const Cloudinary_1 = require("../utils/Cloudinary");
exports.getProducts = catchAsyncError_1.default(async (req, res) => {
    const resPerPage = 4;
    const productsCount = await Product_1.default.countDocuments();
    const apiFeatures = new apiFeatures_1.ApiFeatures(Product_1.default.find(), req.query)
        .search()
        .filter();
    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;
    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        products
    });
});
exports.createProduct = catchAsyncError_1.default(async (req, res, next) => {
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    }
    else {
        images = req.body.images;
    }
    let imagesLink = [];
    for (let i = 0; i < images.length; i++) {
        const response = await Cloudinary_1.saveImage(images[i], next, 'products');
        if (response) {
            imagesLink.push({
                public_id: response.public_id,
                url: response.url
            });
        }
    }
    req.body.images = imagesLink;
    req.body.user = res.locals.user._id;
    req.body.seller = res.locals.user.name;
    const product = await Product_1.default.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
});
exports.getProductById = catchAsyncError_1.default(async (req, res, next) => {
    const product = await Product_1.default.findById(req.params.id);
    if (!product) {
        return next(new errorHandler_1.errorHandler("Product not found", 404));
    }
    return res.status(201).json({
        success: true,
        product
    });
});
exports.updateProduct = catchAsyncError_1.default(async (req, res, next) => {
    const product = await Product_1.default.findById(req.params.id);
    if (!product) {
        return next(new errorHandler_1.errorHandler("Product not found", 404));
    }
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    }
    else {
        images = req.body.images;
    }
    if (images !== undefined) {
        for (let i = 0; i < product.images.length; i++) {
            await Cloudinary_1.destroyImage(product.images[i].public_id, next);
        }
        let imagesLink = [];
        for (let i = 0; i < images.length; i++) {
            const response = await Cloudinary_1.saveImage(images[i], next, 'products');
            if (response) {
                imagesLink.push({
                    public_id: response.public_id,
                    url: response.url
                });
            }
        }
        req.body.images = imagesLink;
    }
    const newproduct = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, {
        useFindAndModify: false,
        runValidators: true,
        new: true
    });
    return res.status(201).json({
        success: true,
        product: newproduct
    });
});
exports.deleteProduct = catchAsyncError_1.default(async (req, res, next) => {
    const product = await Product_1.default.findById(req.params.id);
    if (!product)
        return next(new errorHandler_1.errorHandler("Product not found.", 404));
    for (let i = 0; i < product.images.length; i++) {
        await Cloudinary_1.destroyImage(product.images[i].public_id, next);
    }
    await product.remove();
    return res.json({
        success: true
    });
});
exports.adminGetAllProducts = catchAsyncError_1.default(async (_, res) => {
    const products = await Product_1.default.find();
    return res.json({
        success: true,
        products
    });
});
exports.postProductReview = catchAsyncError_1.default(async (req, res, next) => {
    const { rating, productId } = req.body;
    const review = {
        rating: Number(rating),
        comment: req.body.review,
        user: res.locals.user._id,
        name: res.locals.user.name
    };
    if (rating > 5) {
        next(new errorHandler_1.errorHandler("Rating cannot be above than 5 points.", 400));
    }
    const product = await Product_1.default.findById(productId);
    if (!product)
        return next(new errorHandler_1.errorHandler("Product not found", 400));
    const isReviewed = product.reviews.find(review => review.user.toString() === res.locals.user._id.toString());
    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === res.locals.user._id.toString()) {
                review.comment = req.body.review;
                review.rating = rating;
            }
        });
    }
    else {
        product.reviews.push(review);
    }
    product.numOfReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save({
        validateModifiedOnly: true
    });
    res.status(200).json({
        success: true
    });
});
exports.getAllReviews = catchAsyncError_1.default(async (req, res, next) => {
    const product = await Product_1.default.findById(req.query.id);
    if (!product)
        return next(new errorHandler_1.errorHandler("Product not found", 400));
    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});
exports.deleteProductReview = catchAsyncError_1.default(async (req, res, next) => {
    const product = await Product_1.default.findById(req.query.productId);
    if (!product)
        return next(new errorHandler_1.errorHandler("Product not found", 400));
    product.reviews = product.reviews.filter(review => {
        review._id.toString() !== req.query.id;
    });
    product.numOfReviews = product.reviews.length;
    product.ratings = Number(product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length);
    await product.save({ validateModifiedOnly: true });
    res.status(200).json({
        success: true
    });
});
//# sourceMappingURL=productController.js.map