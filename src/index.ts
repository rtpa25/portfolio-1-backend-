/** @format */

//Dependencies
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import fileupload from 'express-fileupload';
import cloudinary from 'cloudinary';
import cors from 'cors';

//Internal Updates
import connect from './config/db';
import logger from './utils/logger';

//Routes import statements
import user from './routes/user.route';
import product from './routes/product.route';
import order from './routes/order.route';
import cart from './routes/cart.route';
import stripe from './routes/stripe.route';

const app = express();

//cookies and file middleware
app.use(cookieParser());
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: '/temp/',
  })
);

//regular middleware
app.use(express.json({ limit: '50MB' }));
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://portfolio-1-frontend.vercel.app',
      'https://portfolio-1-admin-dashboard.vercel.app',
      'https://portfolio-1-frontend-at9lytyp2-rtpa25.vercel.app',
      'https://portfolio-1-admin-dashboard-91evvl4ya-rtpa25.vercel.app',
    ],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));

//router middleware
app.use('/api/v1', user);
app.use('/api/v1', product);
app.use('/api/v1', order);
app.use('/api/v1', cart);
app.use('/api/v1', stripe);

app.set('trust proxy', 1);

//cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.listen(process.env.PORT || 5000, async () => {
  logger.info(`listening to port ${process.env.PORT}`);
  await connect();
});
