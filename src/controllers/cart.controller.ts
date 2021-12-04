/** @format */

//Dependencies
import { Response, NextFunction } from 'express';

//internal imports
import Cart from '../models/cart.model';
import logger from '../utils/logger';
import { CustomReq } from '../utils/UserCustomReqObject';

//-----CREATE_CART CONTROLLER-----//
export const createCart = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body.user = req.user._id;
    const cart = await Cart.create(req.body);
    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error: any) {
    logger.error(error);
    //send error message
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next();
};

//-----UPDATE_CART CONTROLLER-----// {needs to be more robust}
export const updateCart = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    console.log(updatedCart);
    res.status(200).json({
      success: true,
      updatedCart,
    });
  } catch (error: any) {
    logger.error(error);
    //send error message
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next();
};

//-----DELETE_CART CONTROLLER-----//
export const deleteCart = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Cart deleted successfully',
    });
  } catch (error: any) {
    logger.error(error);
    //send error message
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next();
};

//-----GET_SELF_CART CONTROLLER-----//
export const getSelfCart = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = await Cart.find({ user: req.user._id }).populate('product');

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error: any) {
    logger.error(error);
    //send error message
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next();
};

/*****************************************ADMIN ONLY******************************************/

//-----GET_CERTAIN_CART CONTROLLER-----//
export const getCertainCart = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.isAdmin === false) {
      res.status(400).json({
        success: false,
        message: 'Admin ONLY',
      });
    }
    const cart = await Cart.find({ user: req.params.userId });
    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error: any) {
    logger.error(error);
    //send error message
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next();
};

//-----GET_ALL_CARTS CONTROLLER-----//
export const getAllCart = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.isAdmin === false) {
      res.status(400).json({
        success: false,
        message: 'Admin ONLY',
      });
    }
    const carts = await Cart.find();
    res.status(200).json({
      success: true,
      carts,
    });
  } catch (error: any) {
    logger.error(error);
    //send error message
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next();
};
