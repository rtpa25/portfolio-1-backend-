/** @format */
//DEPENDENCIES
import mongoose from 'mongoose';

//Create Schema
const Schema = mongoose.Schema;

//interface for the ProductSchema
export interface ProductDocument extends mongoose.Document {
  name: string;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
  img: { secure_url: string; id: string };
  categories: string[];
  size: string[];
  color: string[];
  price: number;
}

//create a new instance of schema
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      unique: true,
      maxlength: [120, 'Product name must be shorter than 120 characters'],
    },
    desc: {
      type: String,
      required: [true, 'Product description is required'],
    },
    img: {
      secure_url: {
        type: String,
        required: [true, 'Image url is required and needs to be secure'],
      },
      id: { type: String, required: true },
    },
    categories: { type: Array },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model<ProductDocument>('Product', ProductSchema);

export default ProductModel;
