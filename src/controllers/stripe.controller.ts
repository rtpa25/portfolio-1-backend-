/** @format */

//DEPENDENCIES
import { Response, NextFunction } from 'express';

//internal imports
import logger from '../utils/logger';
import { CustomReq } from '../utils/UserCustomReqObject';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//----SEND_STRIPE_API_KEY---//
export const sendStripeKey = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      stripeKey: process.env.STRIPE_API_KEY,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  next();
};

//----SEND_STRIPE_PAYMENT_INSTANCE---//
export const captureStripePayment = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'inr',
      metadata: { integration_check: 'accept_a_payment' },
    });
    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
      amount: req.body.amount,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  next();
};
