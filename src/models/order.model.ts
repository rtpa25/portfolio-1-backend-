/** @format */
//DEPENDENCIES
import mongoose from 'mongoose';

//Create Schema
const Schema = mongoose.Schema;

//interface for the ProductSchema
export interface OrderDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  orderItems: Object[];
  amount: number;
  status: string;
  address: Object;
  createdAt: Date;
  updatedAt: Date;
}

//create a new instance of schema
const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    address: {
      place: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<OrderDocument>('Order', OrderSchema);

export default OrderModel;
