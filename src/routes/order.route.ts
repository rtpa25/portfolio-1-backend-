/** @format */

//Dependencies
import express from 'express';
import {
  createOrder,
  updateOrder,
  deleteOrder,
  getCertainUserOrder,
  getSelfOrder,
  getAllOrders,
  getLastMonthIncome,
} from '../controllers/order.controller';
import { isLoggedIn } from '../middlewares/userMiddleware';

//create a router instance
const router = express.Router();

/*   /api/v1/createOrder  */
router.route('/createOrder').post(isLoggedIn as any, createOrder as any);

/*   /api/v1/getSelfOrders  */
router.route('/getSelfOrders').get(isLoggedIn as any, getSelfOrder as any);

/*****************************************ADMIN ONLY******************************************/
/*   /api/v1/updateOrder/:id  */
router.route('/updateOrder/:id').put(isLoggedIn as any, updateOrder as any);

/*   /api/v1/deleteOrder/:id  */
router.route('/deleteOrder/:id').delete(isLoggedIn as any, deleteOrder as any);

/*   /api/v1/getCertainUserOrder/:userId  */
router
  .route('/getCertainUserOrder/:userId')
  .get(isLoggedIn as any, getCertainUserOrder as any);

/*   /api/v1/getAllOrders  */
router.route('/getAllOrders').get(isLoggedIn as any, getAllOrders as any);

/*   /api/v1/getLastMonthIncome  */
router
  .route('/getLastMonthIncome')
  .get(isLoggedIn as any, getLastMonthIncome as any);

export default router;
