/** @format */

//Dependencies
import { Response, NextFunction } from 'express';

//internal imports
import Order from '../models/order.model';
import logger from '../utils/logger';
import { CustomReq } from '../utils/UserCustomReqObject';

//-----CREATE_ORDER CONTROLLER-----//
export const createOrder = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    //extract from the request body
    const { orderItems, amount, address } = req.body;
    //create an order in the db
    const order = await Order.create({
      orderItems,
      amount,
      address,
      user: req.user._id, //comes from middleware injection
    });
    //send the order
    res.status(200).json({
      success: true,
      order: order,
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

//-----GET_SELF_ORDER CONTROLLER-----//
export const getSelfOrder = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user._id;
    const orders = await Order.find({ user: id });
    //send the order
    res.status(200).json({
      success: true,
      orders,
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

//-----UPDATE_ORDER CONTROLLER ----//
export const updateOrder = async (
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
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      updatedOrder: updatedOrder,
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

//-----DELETE_ORDER CONTROLLER ----//
export const deleteOrder = async (
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
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Order successfully deleted',
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

//-----GET_SINGLE_USER_ORDER CONTROLLER ----//
export const getCertainUserOrder = async (
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
    const orders = await Order.find({ user: req.params.userId });
    res.status(200).json({
      success: true,
      orders,
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

//-----GET_ALL_ORDERS CONTROLLER ----//
export const getAllOrders = async (
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
    const orders = await Order.find();
    res.status(200).json({
      success: true,
      orders,
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

//-----GET_ALL_ORDERS CONTROLLER ----//
export const getLastMonthIncome = async (
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
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1)
    );
    const income = await Order.aggregate([
      //get's all the orders that were created in the desired period
      { $match: { createdAt: { $gte: previousMonth } } },

      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount',
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      income,
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
