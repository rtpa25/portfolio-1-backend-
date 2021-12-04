/** @format */

import mongoose from 'mongoose';
import logger from '../utils/logger';

const connect = async () => {
  const dbUri = process.env.DB_URL as string;
  try {
    await mongoose.connect(dbUri);
    logger.info('db connected');
  } catch (error: any) {
    logger.error(`Could not connect to the db: ${error.message}`);
    process.exit(1);
  }
};

export default connect;
