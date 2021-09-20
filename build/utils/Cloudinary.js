"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const errorHandler_1 = require("./errorHandler");
exports.default = () => cloudinary_1.default.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
});
exports.saveImage = async (avatar, next, folder) => {
    try {
        const result = await cloudinary_1.default.v2.uploader.upload(avatar, {
            width: folder === "avatars" ? '250' : '400',
            height: folder === "avatars" ? '250' : '450',
            gravity: folder === "avatars" ? "faces" : undefined,
            crop: folder === "avatars" ? "fill" : "fit",
            folder
        });
        console.log("id=", result.public_id, "\n url=", result.secure_url);
        return {
            public_id: result.public_id,
            url: result.secure_url
        };
    }
    catch (error) {
        next(new errorHandler_1.errorHandler(error.message, 400));
    }
};
exports.destroyImage = async (id, next) => {
    try {
        const result = await cloudinary_1.default.v2.uploader.destroy(id);
    }
    catch (error) {
        next(new errorHandler_1.errorHandler(error.message, 400));
    }
};
//# sourceMappingURL=Cloudinary.js.map