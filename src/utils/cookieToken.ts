/** @format */

import { Response } from 'express';
import { UserDocument } from '../models/user.model';

export const cookieToken = (user: UserDocument, res: Response) => {
  const token = user.getJwtToken();

  res
    .status(200)
    .cookie('token', token, {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    })
    .json({
      success: true,
      token,
      user,
    });
};
