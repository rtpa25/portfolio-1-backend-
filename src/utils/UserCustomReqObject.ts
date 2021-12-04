/** @format */

import { Request } from 'express';
import { UserDocument } from '../models/user.model';

export type CustomReq = Request & {
  user: UserDocument; // or any other type
};
