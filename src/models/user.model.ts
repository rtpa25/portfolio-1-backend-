/** @format */

//DEPENDENCIES
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

//get schema from mongoose
const Schema = mongoose.Schema;

//interface for the UserSchema
export interface UserDocument extends mongoose.Document {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  getJwtToken(): string;
  isValidPassword(userSendPassword: string): Promise<boolean>;
}

//create a new instance of schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'User name is a required field'],
      maxlength: [40, 'username can have at most 40 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      validate: [validator.isEmail, 'Please provide a valid email'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is a required field'],
      minlength: [6, 'Password should be at least 6 characters'],
      select: false, //this is for not exposing password to the frontend
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//encrypt password before saving to database - HOOKS
UserSchema.pre('save', async function (next) {
  try {
    const user = this as UserDocument;
    //if the password is not modified then just move on
    if (!user.isModified('password')) return next();
    //if password is modified then encrypt the password
    user.password = await bcrypt.hash(user.password, 10);
  } catch (error) {
    logger.error(error);
  }
  return next();
});

//validate the password while login
UserSchema.methods.isValidPassword = async function (
  userSendPassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  //returns true if the password is correct
  return await bcrypt.compare(userSendPassword, user.password);
};

//create and return JWT token
UserSchema.methods.getJwtToken = function () {
  //auto generated _id by mongoDB
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRY as string,
  });
};

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export default UserModel;
