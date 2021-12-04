/** @format */

//Dependencies
import { Response, NextFunction } from 'express';
import Cloudinary from 'cloudinary';

//internal imports
import Product from '../models/product.model';
import logger from '../utils/logger';
import { CustomReq } from '../utils/UserCustomReqObject';

const cloudinary = Cloudinary.v2;

//-----GET_SINGLE_PRODUCT CONTROLLER ----//
export const getSingleProduct = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(401).json({
        sucess: false,
        message: 'Product not found',
      });
    }
    res.status(200).json({
      sucess: true,
      product: product,
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

//-----GET_ALL_PRODUCTS CONTROLLER ----//
export const getAllProduct = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: qCategory as string[],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json({
      sucess: true,
      products: products,
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

//-----ADD_PRODUCT CONTROLLER ----//
export const addProduct = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    //req.user is the user who is accessing this api
    if (req.user.isAdmin === false) {
      res.status(400).json({
        success: false,
        message: 'Admin Only',
      });
    }

    //if we do not receive files
    if (!req.body.img) {
      res.status(401).json({
        success: false,
        message: 'Image is required to be uploaded',
      });
    }

    const result = await cloudinary.uploader.upload(req.body.img, {
      folder: 'Portfolio_Projects_Products',
    });

    req.body.img = {
      secure_url: result.secure_url,
      id: result.public_id,
    };

    //save the product into the db
    const product = await Product.create(req.body);

    //send sucess message
    res.status(200).json({
      sucess: true,
      product: product,
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

//-----UPDATE_PRODUCT CONTROLLER ----//
export const updateProduct = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    //req.user is the user who is accessing this api
    if (req.user.isAdmin === false) {
      res.status(400).json({
        success: false,
        message: 'Admin Only',
      });
    }
    let product = await Product.findById(req.params.id);
    if (!product) {
      res.status(401).json({
        sucess: false,
        message: 'Product not found',
      });
    }
    if (req.files) {
      await cloudinary.uploader.destroy(product!.img.id);

      const result = await cloudinary.uploader.upload(req.body.img, {
        folder: 'Portfolio_Projects_Products',
      });

      req.body.img = {
        secure_url: result.secure_url,
        id: result.public_id,
      };
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    //send sucess message
    res.status(200).json({
      sucess: true,
      product: product,
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

//-----DELETE_PRODUCT CONTROLLER ----//
export const deleteProduct = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    //req.user is the user who is accessing this api
    if (req.user.isAdmin === false) {
      res.status(400).json({
        success: false,
        message: 'Admin Only',
      });
    }
    let product = await Product.findById(req.params.id);
    if (!product) {
      res.status(401).json({
        sucess: false,
        message: 'Product not found',
      });
    }
    await cloudinary.uploader.destroy(product!.img.id);
    await product!.remove();
    //send sucess message
    res.status(200).json({
      sucess: true,
      message: 'Product was deleted successfully',
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
