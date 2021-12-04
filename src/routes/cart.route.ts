/** @format */

//Dependencies
import express from 'express';
import {
  createCart,
  updateCart,
  deleteCart,
  getSelfCart,
  getCertainCart,
  getAllCart,
} from '../controllers/cart.controller';
import { isLoggedIn } from '../middlewares/userMiddleware';

//create a router instance
const router = express.Router();

/*   /api/v1/createCart   */
router.route('/createCart').post(isLoggedIn as any, createCart as any);

/*   /api/v1/updateCart/:id   */
router.route('/updateCart/:id').put(isLoggedIn as any, updateCart as any);

/*   /api/v1/deleteCart/:id   */
router.route('/deleteCart/:id').delete(isLoggedIn as any, deleteCart as any);

/*   /api/v1/getSelfCart   */
router.route('/getSelfCart').get(isLoggedIn as any, getSelfCart as any);

/*****************************************ADMIN ONLY******************************************/

/*   /api/v1/getCertainCart/:userId   */
router
  .route('/getCertainCart/:userId')
  .get(isLoggedIn as any, getCertainCart as any);

/*   /api/v1/getAllCarts   */
router.route('/getAllCarts').get(isLoggedIn as any, getAllCart as any);

export default router;
