import { IProduct } from '../../interfaces/productI';
import { model, Schema, Model } from "mongoose";



const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [100, "Product name cannot be greater than 100 character."],
      required: [true, "Please enter name."],
    },
    description: {
      type: String,
      required: [true, "Please enter description."],
      maxlength: [600, "Description cannot be greater than 600 characters."],
    },
    price: {
      type: Number,
      required: [true, "Please enter the price."],
      maxlength: [5, "Price cannot be greater than 5 characters."],
    },
    stock: {
      type: Number,
      required: [true, "Stock cannot be empty."],
      maxlength: [5, "Stock cannot be be greater than 99999."],
    },
    numOfReviews: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    category: {
      type: String,
      required: [true, "Please select a category."],
      enum: {
        values: [
          "electronics",
          "food",
          "camera",
          "laptops",
          "mobiles",
          "headphones",
          "accessories",
          "sports",
          "outdoor",
        ],
        message: "Please select the correct category.",
      },
    },
    seller: {
      type: String,
      required: [true, "Seller cannot be unknown."],
    },
    user : {
      type : Schema.Types.ObjectId,
      ref : 'User',
      required: true
    },
    reviews: [
      {
        name: { type: String, required: true },
        rating: {
          type: Number,
          required: true,
        },
        user : {
          type : Schema.Types.ObjectId,
          ref : 'User',
          required: true
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product: Model<IProduct> = model("Product", ProductSchema);

export default Product;
