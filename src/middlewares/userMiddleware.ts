/** @format */

import User, { UserDocument } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { CustomReq } from '../utils/UserCustomReqObject';

export const isLoggedIn = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  console.log(req.cookies);

  try {
    // check token first in cookies
    let token: string = req.cookies.token;

    // if token not found in cookies, check if header contains Auth field
    if (!token && req.header('Authorization')) {
      token = req.header('Authorization')!.replace('Bearer ', '');
    }

    if (!token) {
      res.status(400).json({
        success: false,
        message: 'Token not found',
      });
      return next();
    }
    //retuns the decoded token through which we can accesss the constituents of the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    //id can be extracted from decoded because token is made with _id
    req.user = (await User.findById(decoded.id)) as UserDocument;
    return next();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
    return next();
  }
};
