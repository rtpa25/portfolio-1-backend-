/** @format */
//DEPENDENCIES
import mongoose from 'mongoose';

//Create Schema
const Schema = mongoose.Schema;

//interface for the ProductSchema
export interface CartDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  cartItems: Object[];
}

//create a new instance of schema
const CartSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      minlength: 0,
    },
  },
  { timestamps: true }
);

const CartModel = mongoose.model<CartDocument>('Cart', CartSchema);

export default CartModel;
