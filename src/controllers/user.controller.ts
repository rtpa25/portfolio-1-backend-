/** @format */
//Dependencies
import { Response, Request, NextFunction } from 'express';

//internal imports
import User from '../models/user.model';
import { cookieToken } from '../utils/cookieToken';
import logger from '../utils/logger';
import { CustomReq } from '../utils/UserCustomReqObject';

//-----SIGNUP CONTROLLER ----//
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //grab all the info from req.body after the edge cases
    const { username, email, password } = req.body;

    //check if the required fields are absent
    if (!(email || username || password)) {
      //returns an error message
      return res.status(400).json({
        success: false,
        message: 'Email, Password and UserName are required',
      });
    }

    //create an instance of the user object and store it in the collection
    const user = await User.create({
      username,
      email,
      password,
    });
    //this utility function creates a JWT token and return the response
    cookieToken(user, res);
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

//-----LOGIN CONTROLLER ----//
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get the email and password from the request body
    const { email, password } = req.body;
    //check if email and password are present
    if (!(email || password)) {
      res.status(400).json({
        success: false,
        message: 'Email and password is required',
      });
    }
    //check if the email and hence the user is in the db
    const user = await User.findOne({ email: email }).select('+password');

    //user not in db
    if (!user) {
      res.status(400).json({
        success: false,
        message: 'User in not registered',
      });
    }
    //take the password and validate if it is same with the one in db
    const isPasswordCorrect = await user?.isValidPassword(password);

    //password sent by the user is not correct
    if (!isPasswordCorrect) {
      res.status(400).json({
        success: false,
        message: 'Password is wrong',
      });
    }
    //if password mathces then give him a cookie token
    cookieToken(user!, res);
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

//-----USER_DETAILS CONTROLLER ----//
export const getSelf = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    //this will be achived by the middleware injection
    const user = await User.findById(req.user.id);
    //give away the user details
    res.status(200).json({
      success: true,
      userDetails: user,
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

//-----UPDATE_USER_DETAILS CONTROLLER ----//
export const updateDetails = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;
    const { username, email } = req.body;
    //check if there is no username or email from the client
    if (!(username || email)) {
      res.status(400).json({
        sucess: false,
        message: 'change something to send an update request',
      });
    }
    //new data is the patched data that needs to saved in the db
    const newData = {
      username: username,
      email: email,
    };
    //finds the user by id in the db and updates the user
    const user = await User.findByIdAndUpdate(id, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    //send the new user data back so that we save a get request in the client
    res.status(200).json({
      sucess: true,
      user: user,
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

//-----DELETE_USER CONTROLLER ----//
export const deleteUser = async (
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
    //id from params is the id of the user that is being deleted by the admin
    const { id } = req.params;
    //delete the user from the db
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'User sucessfully deleted',
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

//-----GET_ANY_USER_DETAILS CONTROLLER ----//
export const getAnyUserDetails = async (
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
    //id from params is the id of the user that is being fetched by the admin
    const { id } = req.params;
    //find user from db
    const user = await User.findById(id);
    //check if there doesn't exist such user
    if (!user) {
      res.status(400).json({
        sucess: false,
        message: 'no such user exists',
      });
    }
    //success message
    res.status(200).json({
      sucess: true,
      user: user,
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

//-----GET_ALL_USERS CONTROLLER ----//
export const getAllUsers = async (
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
    const query = req.query.new;
    const users = query
      ? //find the 5 newly created users
        await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json({
      sucess: true,
      users: users,
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

//-----GET_USERS_STATS CONTROLLER ----//
export const getUserStats = async (
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
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    const data = await User.aggregate([
      //condition
      { $match: { createdAt: { $gte: lastYear } } },
      //get's all the users according to their createdAt month
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      //groups all users according to their createdAt month
      {
        $group: {
          //id refers to the month number
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: '_id refers to the month number',
      data: data,
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
